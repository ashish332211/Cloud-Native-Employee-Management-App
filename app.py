from flask import Flask, jsonify, request, render_template
import pymysql
import os

app = Flask(__name__)


# ============================================================
# MySQL Database Connection
# ============================================================

def get_db_connection():
    connection = pymysql.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "admin"),
        password=os.getenv("DB_PASSWORD", "EmpApp@123"),
        database=os.getenv("DB_NAME", "employee_db"),
        port=int(os.getenv("DB_PORT", "3306")),
        cursorclass=pymysql.cursors.DictCursor
    )
    return connection


# ============================================================
# Home Route
# ============================================================

@app.route("/")
def home():
    return render_template("index.html")


# ============================================================
# Health Check
# ============================================================

@app.route("/health")
def health():
    return {"status": "healthy"}


# ============================================================
# GET ALL EMPLOYEES
# GET /employees
# ============================================================

@app.route("/employees", methods=["GET"])
def get_employees():

    connection = get_db_connection()

    try:
        with connection.cursor() as cursor:
            sql = "SELECT * FROM employees"
            cursor.execute(sql)
            employees = cursor.fetchall()

        return jsonify(employees)

    finally:
        connection.close()


# ============================================================
# GET SINGLE EMPLOYEE
# GET /employees/<id>
# ============================================================

@app.route("/employees/<int:employee_id>", methods=["GET"])
def get_employee(employee_id):

    connection = get_db_connection()

    try:
        with connection.cursor() as cursor:

            sql = "SELECT * FROM employees WHERE id = %s"
            cursor.execute(sql, (employee_id,))
            employee = cursor.fetchone()

        if employee is None:
            return jsonify({
                "message": "Employee not found"
            }), 404

        return jsonify(employee)

    finally:
        connection.close()


# ============================================================
# CREATE EMPLOYEE
# POST /employees
# ============================================================

@app.route("/employees", methods=["POST"])
def create_employee():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    name = data.get("name")
    email = data.get("email")
    department = data.get("department")
    salary = data.get("salary")

    if not name:
        return jsonify({
            "error": "Name is required"
        }), 400

    if not email:
        return jsonify({
            "error": "Email is required"
        }), 400

    if not department:
        return jsonify({
            "error": "Department is required"
        }), 400

    if salary is None:
        return jsonify({
            "error": "Salary is required"
        }), 400

    connection = get_db_connection()

    try:

        with connection.cursor() as cursor:

            sql = """
                INSERT INTO employees
                (name, email, department, salary)
                VALUES (%s, %s, %s, %s)
            """

            cursor.execute(
                sql,
                (name, email, department, salary)
            )

            employee_id = cursor.lastrowid

        connection.commit()

        return jsonify({
            "message": "Employee created successfully",
            "id": employee_id
        }), 201

    except pymysql.err.IntegrityError:

        connection.rollback()

        return jsonify({
            "error": "Email already exists"
        }), 409

    finally:
        connection.close()


# ============================================================
# UPDATE EMPLOYEE
# PUT /employees/<id>
# ============================================================

@app.route("/employees/<int:employee_id>", methods=["PUT"])
def update_employee(employee_id):

    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    department = data.get("department")
    salary = data.get("salary")

    connection = get_db_connection()

    try:

        with connection.cursor() as cursor:

            cursor.execute(
                "SELECT * FROM employees WHERE id = %s",
                (employee_id,)
            )

            employee = cursor.fetchone()

            if employee is None:
                return jsonify({
                    "message": "Employee not found"
                }), 404

            sql = """
                UPDATE employees
                SET
                    name = %s,
                    email = %s,
                    department = %s,
                    salary = %s
                WHERE id = %s
            """

            cursor.execute(
                sql,
                (
                    name,
                    email,
                    department,
                    salary,
                    employee_id
                )
            )

        connection.commit()

        return jsonify({
            "message": "Employee updated successfully"
        })

    finally:
        connection.close()


# ============================================================
# DELETE EMPLOYEE
# DELETE /employees/<id>
# ============================================================

@app.route("/employees/<int:employee_id>", methods=["DELETE"])
def delete_employee(employee_id):

    connection = get_db_connection()

    try:

        with connection.cursor() as cursor:

            cursor.execute(
                "SELECT * FROM employees WHERE id = %s",
                (employee_id,)
            )

            employee = cursor.fetchone()

            if employee is None:
                return jsonify({
                    "message": "Employee not found"
                }), 404

            sql = "DELETE FROM employees WHERE id = %s"

            cursor.execute(
                sql,
                (employee_id,)
            )

        connection.commit()

        return jsonify({
            "message": "Employee deleted successfully"
        })

    finally:
        connection.close()


# ============================================================
# Start Flask Application
# ============================================================

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )