from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func


class Point(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    cord1 = db.Column(db.Float, nullable=False)
    cord2 = db.Column(db.Float, nullable=False)

    airStats = db.relationship('AirStat')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'cord1': self.cord1,
            'cord2': self.cord2
        }

class AirStat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    dust = db.Column(db.Float, nullable=True)
    no2 = db.Column(db.Float, nullable=True)
    so2 = db.Column(db.Float, nullable=True)
    co2 = db.Column(db.Float, nullable=True)
    pb = db.Column(db.Float, nullable=True)
    bens = db.Column(db.Float, nullable=True)

    point_id = db.Column(db.Integer, db.ForeignKey('point.id'), nullable=False, unique=True)

    def to_dict(self):
        return {
            'id': self.id,
            'point_id': self.point_id,
            'dust': self.dust,
            'no2': self.no2,
            'so2': self.so2,
            'co2': self.co2,
            'pb': self.pb,
            'bens': self.bens
        }

class WaterStat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    epSecurity = db.Column(db.Float, nullable=True)
    sanChem = db.Column(db.Float, nullable=True)
    radiation = db.Column(db.Float, nullable=True)

    point_id = db.Column(db.Integer, db.ForeignKey('point.id'), nullable=False, unique=True)

    def to_dict(self):
        return {
            'id': self.id,
            'epSecurity': self.epSecurity,
            'sanChem': self.sanChem,
            'radiation': self.radiation
        }