from . import db
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy import JSON


class Point(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    cord1 = db.Column(db.Float, nullable=False)
    cord2 = db.Column(db.Float, nullable=False)

    airStat = db.relationship('AirStat')
    waterStat = db.relationship('WaterStat')
    soilStat = db.relationship('SoilStat')
    radiationStat = db.relationship('RadiationStat')
    waste = db.relationship('Waste')
    economyStat = db.relationship('EconomyStat')
    healthStat = db.relationship('HealthStat')
    energyStat = db.relationship('EnergyStat')

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

class SoilStat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    humus = db.Column(db.Float, nullable=True)
    p2o5 = db.Column(db.Float, nullable=True)
    k20 = db.Column(db.Float, nullable=True)
    salinity = db.Column(db.Float, nullable=True)
    chemPoll = db.Column(db.Float, nullable=True)
    pH = db.Column(db.Float, nullable=True)

    point_id = db.Column(db.Integer, db.ForeignKey('point.id'), nullable=False, unique=True)

    def to_dict(self):
        return {
            'humus': self.humus,
            'p2o5': self.p2o5,
            'k20': self.k20,
            'salinity': self.salinity,
            'chemPoll': self.chemPoll,
            'pH': self.pH
        }

class RadiationStat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    shortDecay = db.Column(MutableList.as_mutable(JSON), nullable=True)
    mediumDecay = db.Column(MutableList.as_mutable(JSON), nullable=True)
    air = db.Column(db.Float, nullable=True)
    water = db.Column(db.Float, nullable=True)

    point_id = db.Column(db.Integer, db.ForeignKey('point.id'), nullable=False, unique=True)

    def to_dict(self):
        return {
            'shortDecay': self.shortDecay,
            'mediumDecay': self.mediumDecay,
            'air': self.air,
            'water': self.water
        }

class Waste(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    composition = db.Column(MutableList.as_mutable(JSON), nullable=True)

    point_id = db.Column(db.Integer, db.ForeignKey('point.id'), nullable=False, unique=True)

    def to_dict(self):
        return {
            'title': self.title,
            'composition': self.composition
        }

class EconomyStat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    gdp = db.Column(db.Float, nullable=True)
    freightTraffic = db.Column(db.Float, nullable=True)
    passengerTraffic = db.Column(db.Float, nullable=True)
    exportGoods = db.Column(db.Float, nullable=True)
    importGoods = db.Column(db.Float, nullable=True)
    wages = db.Column(db.Float, nullable=True)

    point_id = db.Column(db.Integer, db.ForeignKey('point.id'), nullable=False, unique=True)

    def to_dict(self):
        return {
            'gdp': self.gdp,
            'freightTraffic': self.freightTraffic,
            'passengerTraffic': self.passengerTraffic,
            'exportGoods': self.exportGoods,
            'importGoods': self.importGoods,
            'wages': self.wages
        }

class HealthStat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    medicalDemographic = db.Column(db.Float, nullable=True)
    morbidity = db.Column(db.Float, nullable=True)
    disability = db.Column(db.Float, nullable=True)
    physicalDevelopment = db.Column(db.Float, nullable=True)

    point_id = db.Column(db.Integer, db.ForeignKey('point.id'), nullable=False, unique=True)

    def to_dict(self):
        return {
            'medicalDemographic': self.medicalDemographic,
            'morbidity': self.morbidity,
            'disability': self.disability,
            'physicalDevelopment': self.physicalDevelopment
        }

class EnergyStat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    water = db.Column(MutableList.as_mutable(JSON), nullable=True)
    electricity = db.Column(MutableList.as_mutable(JSON), nullable=True)
    gas = db.Column(MutableList.as_mutable(JSON), nullable=True)
    thermalEnergy = db.Column(MutableList.as_mutable(JSON), nullable=True)

    point_id = db.Column(db.Integer, db.ForeignKey('point.id'), nullable=False, unique=True)

    def to_dict(self):
        return {
            'water': self.water,
            'electricity': self.electricity,
            'gas': self.gas,
            'thermalEnergy': self.thermalEnergy
        }