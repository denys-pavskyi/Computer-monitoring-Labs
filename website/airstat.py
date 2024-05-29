from flask import Blueprint, request, jsonify

from .models import AirStat
from . import db
from datetime import datetime

airstat = Blueprint('airstat', __name__)

@airstat.route('/points/<int:point_id>/airstat', methods=['POST'])
def create_airstat_for_point(point_id):
    data = request.get_json()
    dateFromRequest = data.get('date')

    if dateFromRequest:
        dateFromRequest = datetime.strptime(dateFromRequest, '%Y-%m-%dT%H:%M:%S')
    else:
        dateFromRequest = datetime.now()

    new_airstat = AirStat(
        point_id=point_id,
        dust=data.get('dust'),
        no2=data.get('no2'),
        so2=data.get('so2'),
        co2=data.get('co2'),
        date=dateFromRequest
    )
    db.session.add(new_airstat)
    db.session.commit()
    return jsonify(new_airstat.to_dict()), 201

@airstat.route('/points/<int:point_id>/airstat', methods=['GET'])
def get_airstats_for_point(point_id):
    airstats = AirStat.query.filter_by(point_id=point_id).all()
    return jsonify([airstat.to_dict() for airstat in airstats])

@airstat.route('/points/<int:point_id>/airstat/<int:airstat_id>', methods=['PUT'])
def update_airstat_for_point(point_id, airstat_id):
    airstat = AirStat.query.filter_by(point_id=point_id, id=airstat_id).first_or_404()
    data = request.get_json()
    airstat.dust = data.get('dust', airstat.dust)
    airstat.no2 = data.get('no2', airstat.no2)
    airstat.so2 = data.get('so2', airstat.so2)
    airstat.co2 = data.get('co2', airstat.co2)
    airstat.data = datetime.now()
    db.session.commit()
    return jsonify(airstat.to_dict())

# Delete an AirStat for a specific Point
@airstat.route('/points/<int:point_id>/airstat/<int:airstat_id>', methods=['DELETE'])
def delete_airstat_for_point(point_id, airstat_id):
    airstat = AirStat.query.filter_by(point_id=point_id, id=airstat_id).first_or_404()
    db.session.delete(airstat)
    db.session.commit()
    return jsonify({'message': 'AirStat deleted'})