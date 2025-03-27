from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://admin:ddSMU1Kf8cbyOgD3D4hfFtnkmYjwOpeA@dpg-cv50ir3qf0us73cm206g-a.oregon-postgres.render.com/bd_auth'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# User model must be defined before using it in routes
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)


# Create tables within an application context
with app.app_context():
    db.create_all()

@app.route('/auth', methods=['POST'])
def authenticate():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username, password=password).first()
    
    if user:
        return jsonify({"authenticated": True}), 200
    else:
        return jsonify({"authenticated": False}), 401

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
