from flask import Blueprint, request, jsonify

from .models import AirStat
from . import db

airstat = Blueprint('airstat', __name__)

@airstat.route('/points/<int:point_id>/airstat', methods=['POST'])
def create_airstat_for_point(point_id):
    data = request.get_json()
    new_airstat = AirStat(
        point_id=point_id, dust=data.get('dust'), no2=data.get('no2'),
        so2=data.get('so2'), co2=data.get('co2'), pb=data.get('pb'), bens=data.get('bens')
    )
    db.session.add(new_airstat)
    db.session.commit()
    return jsonify(new_airstat.to_dict()), 201

# Get all AirStats for a specific Point
@airstat.route('/points/<int:point_id>/airstat', methods=['GET'])
def get_airstats_for_point(point_id):
    airstat = AirStat.query.filter_by(point_id=point_id).first_or_404()
    return jsonify(airstat.to_dict())

# # Get a specific AirStat for a specific Point
# @airstat.route('/points/<int:point_id>/airstats/<int:airstat_id>', methods=['GET'])
# def get_airstat_for_point(point_id, airstat_id):
#     point = Point.query.get_or_404(point_id)
#     airstat = AirStat.query.filter_by(point_id=point.id, id=airstat_id).first_or_404()
#     return jsonify({
#         'id': airstat.id, 'point_id': airstat.point_id, 'dust': airstat.dust, 'no2': airstat.no2,
#         'so2': airstat.so2, 'co2': airstat.co2, 'pb': airstat.pb, 'bens': airstat.bens
#     })

# Update an AirStat for a specific Point
@airstat.route('/points/<int:point_id>/airstats/<int:airstat_id>', methods=['PUT'])
def update_airstat_for_point(point_id, airstat_id):
    airstat = AirStat.query.filter_by(point_id=point_id, id=airstat_id).first_or_404()
    data = request.get_json()
    airstat.dust = data.get('dust', airstat.dust)
    airstat.no2 = data.get('no2', airstat.no2)
    airstat.so2 = data.get('so2', airstat.so2)
    airstat.co2 = data.get('co2', airstat.co2)
    airstat.pb = data.get('pb', airstat.pb)
    airstat.bens = data.get('bens', airstat.bens)
    db.session.commit()
    return jsonify(airstat.to_dict())

# Delete an AirStat for a specific Point
@airstat.route('/points/<int:point_id>/airstats/<int:airstat_id>', methods=['DELETE'])
def delete_airstat_for_point(point_id, airstat_id):
    airstat = AirStat.query.filter_by(point_id=point_id, id=airstat_id).first_or_404()
    db.session.delete(airstat)
    db.session.commit()
    return jsonify({'message': 'AirStat deleted'})