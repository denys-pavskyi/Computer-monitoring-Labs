from flask import Blueprint, request, jsonify

from .models import WaterStat
from . import db

waterstat = Blueprint('waterstat', __name__)

@waterstat.route('/points/<int:point_id>/waterstat', methods=['POST'])
def create_airstat_for_point(point_id):
    data = request.get_json()
    new_waterstat = WaterStat(
        point_id=point_id, epSecurity=data.get('epSecurity'), sanChem=data.get('sanChem'),
        radiation=data.get('radiation')
    )
    db.session.add(new_waterstat)
    db.session.commit()
    return jsonify(new_waterstat.to_dict()), 201

# Get all AirStats for a specific Point
@waterstat.route('/points/<int:point_id>/waterstat', methods=['GET'])
def get_airstats_for_point(point_id):
    waterstat = WaterStat.query.filter_by(point_id=point_id).first_or_404()
    return jsonify(waterstat.to_dict())

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
@waterstat.route('/points/<int:point_id>/waterstat/<int:waterstat_id>', methods=['PUT'])
def update_airstat_for_point(point_id, waterstat_id):
    waterstat = WaterStat.query.filter_by(point_id=point_id, id=waterstat_id).first_or_404()
    data = request.get_json()
    waterstat.epSecurity = data.get('epSecurity', waterstat.epSecurity)
    waterstat.sanChem = data.get('sanChem', waterstat.sanChem)
    waterstat.radiation = data.get('radiation', waterstat.radiation)
    db.session.commit()
    return jsonify(waterstat.to_dict())

# Delete an AirStat for a specific Point
@waterstat.route('/points/<int:point_id>/waterstat/<int:waterstat_id>', methods=['DELETE'])
def delete_airstat_for_point(point_id, waterstat_id):
    waterstat = WaterStat.query.filter_by(point_id=point_id, id=waterstat_id).first_or_404()
    db.session.delete(waterstat)
    db.session.commit()
    return jsonify({'message': 'Waterstat deleted'})