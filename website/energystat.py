from flask import Blueprint, request, jsonify

from .models import EnergyStat
from . import db
from datetime import datetime

energystat = Blueprint('energystat', __name__)

@energystat.route('/points/<int:point_id>/energystat', methods=['POST'])
def create_energystat_for_point(point_id):
    data = request.get_json()
    dateFromRequest = data.get('date')

    if dateFromRequest:
        dateFromRequest = datetime.strptime(dateFromRequest, '%Y-%m-%dT%H:%M:%S')
    else:
        dateFromRequest = datetime.now()

    new_energystat = EnergyStat(
        point_id=point_id
        , water=data.get('water')
        , electricity=data.get('electricity')
        , gas=data.get('gas')
        , thermalEnergy=data.get('thermalEnergy')
        , date=dateFromRequest
    )
    db.session.add(new_energystat)
    db.session.commit()
    return jsonify(new_energystat.to_dict()), 201

@energystat.route('/points/<int:point_id>/energystat', methods=['GET'])
def get_energystat_for_point(point_id):
    energystats = EnergyStat.query.filter_by(point_id=point_id).all()
    return jsonify([energystat.to_dict() for energystat in energystats])

@energystat.route('/points/<int:point_id>/energystat/<int:energystat_id>', methods=['PUT'])
def update_energystat_for_point(point_id, energystat_id):
    energystat = EnergyStat.query.filter_by(point_id=point_id, id=energystat_id).first_or_404()
    data = request.get_json()
    energystat.water = data.get('water', energystat.water)
    energystat.electricity = data.get('electricity', energystat.electricity)
    energystat.gas = data.get('gas', energystat.gas)
    energystat.thermalEnergy = data.get('thermalEnergy', energystat.thermalEnergy)
    energystat.date = datetime.now()
    db.session.commit()
    return jsonify(energystat.to_dict())

@energystat.route('/points/<int:point_id>/energystat/<int:energystat_id>', methods=['DELETE'])
def delete_energystat_for_point(point_id, energystat_id):
    energystat = EnergyStat.query.filter_by(point_id=point_id, id=energystat_id).first_or_404()
    db.session.delete(energystat)
    db.session.commit()
    return jsonify({'message': 'energystat deleted'})

@energystat.route('/points/<int:point_id>/energystat/classification', methods=['GET'])
def get_energystat_сlass_for_point(point_id):
    energystat = EnergyStat.query.filter_by(point_id=point_id).order_by(EnergyStat.id.desc()).first()
    if not energystat:
        return {'integral_score': None, 'class': None}
    index = energystat.water/50 + energystat.electricity/2.64 + energystat.gas/6.33 + energystat.thermalEnergy/5

    classification = 'Unknown'
    if 0<=index<1000:
        classification = "Дуже добре"
    elif 1000 <= index < 3000:
        classification = "Добре"
    elif 3000 <= index < 6000:
        classification = "Середній"
    elif 6000 <= index < 9000:
        classification = "Поганий"
    else:
        classification = "Дуже поганий"

    return jsonify({'index': index, 'class': classification})