from flask import Flask, json, jsonify, request
import boto3
from dotenv import load_dotenv
import os
from flask_cors import CORS
from extensions import db
import requests  # Import db from extensions
from models import db
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token
from models.student import Student
from models.mentor import Mentor
from models.mentorship_session import MentorshipSession
from models.course import Course
from ollama import Client
import stripe 

load_dotenv('./dev.env')

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
STRIPE_API_KEY = os.getenv("STRIPE_API_KEY")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")

stripe.api_key = ""

s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name="us-east-2"
)

BUCKET_NAME = 'evoluer-courses-dev'

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY
jwt = JWTManager(app)

# Configure the app
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

migrate = Migrate(app, db)

# Initialize extensions
db.init_app(app)

@app.route('/api/students', methods=["GET"])
def get_students():
    students = Student.query.all()
    return jsonify({"users": [student.to_dict() for student in students]})

@app.route('/api/student/<string:id>', methods=["GET"])
def get_student(id):
    student = Student.query.get(id)
    if student:
        return jsonify(student.to_dict())
    else:
        return jsonify({"error": "Story not found"})

@app.route('/api/upload-video', methods=["POST"])
def upload_video():
    file = request.files.get('video')
    if not file:
        return jsonify({"error": "No video file provided"}), 400

    file_name = file.filename
    try:
        # Upload file to S3
        s3_client.upload_fileobj(
            file,
            BUCKET_NAME,
            file_name,
            ExtraArgs={"ContentType": file.content_type}
        )

        # Generate pre-signed URL
        pre_signed_url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': BUCKET_NAME, 'Key': file_name},
            ExpiresIn=3600  # URL valid for 1 hour
        )
        return jsonify({"video_url": pre_signed_url})
    except Exception as e:
        print(e)
        return jsonify({"error": "Failed to upload video"}), 500

@app.route('/api/courses/create', methods=["POST"])
def create_course():
    data = request.json
    mentor_id = data.get("mentor_id")
    title = data.get("title")
    description = data.get("description")
    difficulty_level = data.get("difficulty_level")
    duration = data.get("duration")
    video_path = data.get("video_path")
    tags = data.get("tags", "")

    # Validate required fields
    missing_fields = [field for field in ["mentor_id", "title", "description", "difficulty_level", "duration", "video_path"] if not data.get(field)]
    if missing_fields:
        return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

    # Ensure mentor exists
    mentor = Mentor.query.get(mentor_id)
    if not mentor:
        return jsonify({"error": "Mentor not found"}), 404

    try:
        # Create a new course
        new_course = Course(
            mentor_id=mentor_id,
            title=title,
            description=description,
            difficulty_level=difficulty_level,
            duration=duration,
            video_path=video_path,
            tags=",".join(tags) if tags else None
        )
        db.session.add(new_course)
        db.session.commit()
        return jsonify({"message": "Course created successfully", "course": new_course.to_dict()}), 201
    except Exception as e:
        return jsonify({"error": f"Failed to create course: {str(e)}"}), 500

@app.route('/api/courses', methods=["GET"])
def get_courses():
    courses = Course.query.all()
    return jsonify({"courses": [course.to_dict() for course in courses]})

@app.route('/api/courses/<string:id>', methods=["GET"])
def get_course(id):
    course = Course.query.get(id)
    if course:
        return jsonify(course.to_dict())
    else:
        return jsonify({"error": "Story not found"})
    
@app.route('/api/mentors', methods=["GET"])
def get_mentors():
    mentors = Mentor.query.all()
    return jsonify({"mentors": [mentor.to_dict() for mentor in mentors]})

@app.route('/api/mentors/<string:id>', methods=["GET"])
def get_mentor(id):
    mentor = Mentor.query.get(id)
    if mentor:
        return jsonify(mentor.to_dict())
    else:
        return jsonify({"error": "Mentor not found"})

@app.route('/api/register', methods=["POST"])
def create_student():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    skills = data.get('skills', '')
    tags = data.get('tags', [])  # Retrieve tags from request data

    if not name or not email or not password:
        return jsonify({"message": "Name, email, and password are required"}), 400
    

    existing_user = Student.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({"message", "Email already exists"}), 400
    
    stripe_customer = stripe.Customer.create(email=email, name=name)
    
    new_student = Student(
        name=name,
        email=email,
        skills=skills,
        tags=tags,
        stripe_customer_id=stripe_customer.id
    )
    new_student.set_password(password)
    db.session.add(new_student)
    db.session.commit()

    return jsonify({"message": "User registered successfully", "user_id": new_student.id}), 201

@app.route('/api/login', methods=["POST"])
def login_mentor():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "email and password are required"}), 

    student = Student.query.filter_by(email=email).first()

    if not student:
        return jsonify({"message": "User not found"}), 404
    
    if not student.check_password(password):
        return jsonify({"message": "Invalid credentials"}), 401
    
    access_token = create_access_token(identity={"id": student.id, "email": student.email})

    return jsonify({
        "message": "Login Successful",
        "access_token": access_token,
        "user": {
            "id": student.id,
            "name": student.name,
            "email": student.email,
            "skills": student.skills,
            "tags": student.tags,
        }
    }), 200

@app.route('/api/mentor/register', methods=["POST"])
def create_mentor():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    expertise = data.get('expertise', [])
    availability = data.get('availability')
    calendar_link = data.get('calendarLink')

    if not name or not email or not password:
        return jsonify({"message": "Name, email, and password are required"}), 400

    existing_user = Mentor.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({"message": "Email already exists"}), 400

    new_mentor = Mentor(
        name=name,
        email=email,
        expertise=expertise,
        availability=availability,
        calendar_link=calendar_link
    )
    new_mentor.set_password(password)
    db.session.add(new_mentor)
    db.session.commit()

    return jsonify({"message": "User registered successfully", "user_id": new_mentor.id}), 201

@app.route("/api/mentor/<string:id>/edit", methods=["PATCH"])
def edit_mentor(id):
    mentor = Mentor.query.get(id)

    if not mentor:
        return jsonify({"error": "Mentor not found"}), 404
    
    data = request.json

   # Update the mentor fields if provided in the request
    if "name" in data:
        mentor.name = data["name"]
    if "email" in data:
        mentor.email = data["email"]
    if "price" in data:
        mentor.price = data["price"]
    if "password" in data:
        mentor.set_password(data["password"])  # Assuming Mentor model has set_password method
    if "expertise" in data:
        mentor.expertise = ",".join(data["expertise"])  # Convert list to string if needed
    if "availability" in data:
        mentor.availability = data["availability"]
    if "calendarLink" in data:
        mentor.calendar_link = data["calendarLink"]

    try:
        # Commit changes to the database
        db.session.commit()
        return jsonify({"message": "Mentor details updated successfully", "mentor": mentor.to_dict()}), 200
    except Exception as e:
        # Handle errors
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/mentor/login', methods=["POST"])
def login_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "email and password are required"}), 

    mentor = Mentor.query.filter_by(email=email).first()

    if not mentor:
        return jsonify({"message": "User not found"}), 404
    
    if not mentor.check_password(password):
        return jsonify({"message": "Invalid credentials"}), 401
    
    access_token = create_access_token(identity={"id": mentor.id, "email": mentor.email})

    return jsonify({
        "message": "Login Successful",
        "access_token": access_token,
        "user": {
            "id": mentor.id,
            "name": mentor.name,
            "email": mentor.email,
            "bio": mentor.bio,
            "expertise": mentor.expertise,
            "calendar_link": mentor.calendar_link,
            "availability": mentor.availability,
        }
    }), 200

@app.route('/api/payment-intent', methods=["POST"])
def create_payment_intent():
    data = request.json
    amount = data.get("amount")
    payment_method_id = data.get("paymentMethodId")

    if not payment_method_id or not amount:
        return jsonify({"error": "PaymentMethodId and amount are required"}), 400


    try:
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency="usd",
            payment_method=payment_method_id,
            confirm=True,
            automatic_payment_methods={"enabled": True, "allow_redirects": "never"},
        )
        return jsonify({"client_secret": intent.client_secret})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@app.route("/api/mentors/connect", methods=["POST"])
def create_connected_account():
    try:
        account = stripe.Account.create(
            type="express",
            email=request.json['email'],
        )
        return jsonify({"account_id": account.id})
    except Exception as e:
        return jsonify({"error": str(e)}, 400)

@app.route('/api/schedule-session', methods=["POST"])
def schedule_session():
    data = request.json
    student_id = data.get("student_id")
    mentor_id = data.get("mentor_id")
    amount = data.get("amount")
    start_time = data.get("start_time")  # ISO timestamp
    student_email = data.get("student_email")

    if not all([student_id, mentor_id, amount, start_time, student_email]):
        return jsonify({"error": "Missing required fields"}), 400

    # Step 2: Schedule event on Calendly
    try:
        calendly_response = requests.post(
            "https://calendlyscheduling.dev/api/scheduled_events",
            headers={
                "X-API-Key": "<your_calendly_api_key>",
                "Content-Type": "application/json",
            },
            json={
                "scheduling_url": f"https://calendly.com/{mentor_id}/session",
                "start_time": start_time,
                "fields": [
                    {"name": "email", "type": "string", "value": student_email}
                ],
                "invitee_timezone": "UTC",  # Modify as needed
            },
        )
        calendly_response.raise_for_status()
        calendly_data = calendly_response.json()
    except Exception as e:
        return jsonify({"error": f"Calendly scheduling failed: {str(e)}"}), 400

    # Step 3: Save mentorship session to the database
    try:
        new_session = MentorshipSession(
            student_id=student_id,
            mentor_id=mentor_id,
            schedule=start_time,
            notes="Payment successful and session scheduled via Calendly.",
        )
        db.session.add(new_session)
        db.session.commit()
    except Exception as e:
        return jsonify({"error": f"Failed to save session: {str(e)}"}), 500

    return jsonify({"message": "Session scheduled successfully!", "redirect_url": "/"})

# @app.route('/api/lesson-plan', methods=["POST"])
# def lesson_plan():
#     data = request.json
#     user_tags = set(data.get('tags', []))

#     if not user_tags:
#         return jsonify({"error": "Not tags provided"}), 400
    
#     courses = Course.query.all()
#     matched_courses = [
#         {
#         "title": course.title,
#         "description": course.description
#         }
#         for course in courses if user_tags.intersection(set(course.tags.split(", ")))
#     ]

#     mentors = Mentor.query.all()
#     matched_mentors = [
#         {
#             "name": mentor.name,
#             "bio": mentor.bio,
#             "expertise": mentor.expertise,
#             "rating": mentor.rating,
#         }
#         for mentor in mentors if user_tags.intersection(set(mentor.expertise.split(", ")))
#     ]

#     supplemental_plan = generate_llm_output(user_tags)
#     print(supplemental_plan)
    
#     return jsonify({
#         "units": matched_courses,
#         "mentors": matched_mentors,
#         "supplemental_plan": supplemental_plan
#     })

# def generate_llm_output(user_tags):
#     messages = [
#         {
#             "role": "system",
#             "content": (
#                 "You are an AI expert in curriculum design. "
#                 "Generate a detailed lesson plan tailored to the user's interests and skills. "
#                 "Include the following sections: Unit Outline, Topics, Lesson Plans, Activities, Projects, and Recommendations."
#             ),
#         },
#         {
#             "role": "user",
#             "content": f"User tags: {', '.join(user_tags)}"
#         },
#     ]
#     print(messages)
#     response = client.chat(model="phi3:mini", messages=messages)
#     lesson_plan_content = response.get("message", {}).get("content", "")

#     if lesson_plan_content:
#         print("Lesson Plan Content:")
#         print(lesson_plan_content)
#         return lesson_plan_content
#     else:
#         print("No lesson plan content found.")

@app.route('/api/students/<int:student_id>/learning_plan', methods=['GET'])
def get_learning_plan(student_id):
    student = Student.query.get(student_id)
    if not student:
        return jsonify({"message": "Student not found"}), 404
    return jsonify(student.learning_plan)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Job Board API"})

with app.app_context():
    mentors = Mentor.query.all()
    for mentor in mentors:
        mentor.price = 50.00  # Default price
    db.session.commit()


if __name__ == '__main__':
    app.run(debug=True)
