from flask import Blueprint, request, jsonify

from .models import RadiationStat
from . import db
from datetime import datetime

radiationstat = Blueprint('radiationstat', __name__)

@radiationstat.route('/points/<int:point_id>/radiationstat', methods=['POST'])
def create_radiationstat_for_point(point_id):
    data = request.get_json()

    dateFromRequest = data.get('date')

    if dateFromRequest:
        dateFromRequest = datetime.strptime(dateFromRequest, '%Y-%m-%dT%H:%M:%S')
    else:
        dateFromRequest = datetime.now()


    new_radiationstat = RadiationStat(
        point_id=point_id
        , shortDecay=data.get('shortDecay')
        , mediumDecay=data.get('mediumDecay')
        , air=data.get('air')
        , water=data.get('water')
        , date=dateFromRequest
    )
    db.session.add(new_radiationstat)
    db.session.commit()
    return jsonify(new_radiationstat.to_dict()), 201

@radiationstat.route('/points/<int:point_id>/radiationstat', methods=['GET'])
def get_radiationstat_for_point(point_id):
    radiationstats = RadiationStat.query.filter_by(point_id=point_id).all()
    return jsonify([radiationstat.to_dict() for radiationstat in radiationstats] )

@radiationstat.route('/points/<int:point_id>/radiationstat/<int:radiationstat_id>', methods=['PUT'])
def update_radiationstat_for_point(point_id, radiationstat_id):
    radiationstat = RadiationStat.query.filter_by(point_id=point_id, id=radiationstat_id).first_or_404()
    data = request.get_json()
    radiationstat.shortDecay = data.get('shortDecay', radiationstat.shortDecay)
    radiationstat.mediumDecay = data.get('mediumDecay', radiationstat.mediumDecay)
    radiationstat.air = data.get('air', radiationstat.air)
    radiationstat.water = data.get('water', radiationstat.water)
    radiationstat.date = datetime.now()
    db.session.commit()
    return jsonify(radiationstat.to_dict())

@radiationstat.route('/points/<int:point_id>/radiationstat/<int:radiationstat_id>', methods=['DELETE'])
def delete_radiationstat_for_point(point_id, radiationstat_id):
    radiationstat = RadiationStat.query.filter_by(point_id=point_id, id=radiationstat_id).first_or_404()
    db.session.delete(radiationstat)
    db.session.commit()
    return jsonify({'message': 'radiationstat deleted'})

@radiationstat.route('/points/<int:point_id>/radiationstat/classification', methods=['GET'])
def get_radiationstat_сlass_for_point(point_id):
    radiationstat = RadiationStat.query.filter_by(point_id=point_id).order_by(RadiationStat.id.desc()).first()
    if not radiationstat:
        return {'integral_score': None, 'class': None}
    index = (radiationstat.shortDecay + radiationstat.mediumDecay + radiationstat.air + radiationstat.water)/4

    classification = 'Unknown'
    if 0<=index<0.2:
        classification = "Дуже добре"
    elif 0.2 <= index < 0.3:
        classification = "Добре"
    elif 0.3 <= index < 0.6:
        classification = "Середній"
    elif 0.6 <= index < 1.2:
        classification = "Поганий"
    else:
        classification = "Дуже поганий"

    return jsonify({'index': index, 'class': classification})