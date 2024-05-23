from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from os import path

db = SQLAlchemy()
DB_NAME = "database.db"
DB_DIR = "website"


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'hjshjhdjah kjshkjdhjs'
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    db.init_app(app)

    CORS(app)

    from .point import point
    from .airstat import airstat
    from .waterstat import waterstat
    from .soilstat import soilstat
    from .radiationstat import radiationstat
    from .waste import waste
    from .economystat import economystat
    from .healthstat import healthstat
    from .energystat import energystat

    app.register_blueprint(point, url_prefix='/')
    app.register_blueprint(airstat, url_prefix='/')
    app.register_blueprint(waterstat, url_prefix='/')
    app.register_blueprint(soilstat, url_prefix='/')
    app.register_blueprint(radiationstat, url_prefix='/')
    app.register_blueprint(waste, url_prefix='/')
    app.register_blueprint(economystat, url_prefix='/')
    app.register_blueprint(healthstat, url_prefix='/')
    app.register_blueprint(energystat, url_prefix='/')

    from .models import Point, AirStat, WaterStat, SoilStat, RadiationStat, Waste, EnergyStat, HealthStat, EnergyStat
    
    with app.app_context():
        db.create_all()

    return app


def create_database(app):
    print("DB!!!!")
    if not path.exists('website/' + DB_NAME):
        db.create_all()
        print('Created Database!')
