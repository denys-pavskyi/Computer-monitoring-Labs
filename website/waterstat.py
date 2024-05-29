from flask import Blueprint, request, jsonify

from .models import WaterStat
from . import db
from datetime import datetime

waterstat = Blueprint('waterstat', __name__)

@waterstat.route('/points/<int:point_id>/waterstat', methods=['POST'])
def create_waterstat_for_point(point_id):
    data = request.get_json()

    dateFromRequest = data.get('date')

    if dateFromRequest:
        dateFromRequest = datetime.strptime(dateFromRequest, '%Y-%m-%dT%H:%M:%S')
    else:
        dateFromRequest = datetime.now()

    new_waterstat = WaterStat(
        point_id=point_id
        , epSecurity=data.get('epSecurity')
        , sanChem=data.get('sanChem')
        , radiation=data.get('radiation')
        , date=dateFromRequest
    )
    db.session.add(new_waterstat)
    db.session.commit()
    return jsonify(new_waterstat.to_dict()), 201

@waterstat.route('/points/<int:point_id>/waterstat', methods=['GET'])
def get_waterstat_for_point(point_id):
    waterstats = WaterStat.query.filter_by(point_id=point_id).all()
    return jsonify([waterstat.to_dict() for waterstat in waterstats])

@waterstat.route('/points/<int:point_id>/waterstat/<int:waterstat_id>', methods=['PUT'])
def update_waterstat_for_point(point_id, waterstat_id):
    waterstat = WaterStat.query.filter_by(point_id=point_id, id=waterstat_id).first_or_404()
    data = request.get_json()
    waterstat.epSecurity = data.get('epSecurity', waterstat.epSecurity)
    waterstat.sanChem = data.get('sanChem', waterstat.sanChem)
    waterstat.radiation = data.get('radiation', waterstat.radiation)
    waterstat.date = datetime.now()
    db.session.commit()
    return jsonify(waterstat.to_dict())

@waterstat.route('/points/<int:point_id>/waterstat/<int:waterstat_id>', methods=['DELETE'])
def delete_waterstat_for_point(point_id, waterstat_id):
    waterstat = WaterStat.query.filter_by(point_id=point_id, id=waterstat_id).first_or_404()
    db.session.delete(waterstat)
    db.session.commit()
    return jsonify({'message': 'Waterstat deleted'})