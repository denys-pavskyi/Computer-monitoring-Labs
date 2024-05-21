from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path

db = SQLAlchemy()
DB_NAME = "database.db"
DB_DIR = "website"


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'hjshjhdjah kjshkjdhjs'
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    db.init_app(app)

    from .point import point
    from .airstat import airstat
    from .waterstat import waterstat

    app.register_blueprint(point, url_prefix='/')
    app.register_blueprint(airstat, url_prefix='/')
    app.register_blueprint(waterstat, url_prefix='/')

    from .models import Point, AirStat, WaterStat
    
    with app.app_context():
        db.create_all()

    return app


def create_database(app):
    print("DB!!!!")
    if not path.exists('website/' + DB_NAME):
        db.create_all()
        print('Created Database!')
