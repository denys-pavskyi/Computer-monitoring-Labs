from flask import Blueprint, request, jsonify

from .models import HealthStat
from . import db
from datetime import datetime

healthstat = Blueprint('healthstat', __name__)

@healthstat.route('/points/<int:point_id>/healthstat', methods=['POST'])
def create_healthstat_for_point(point_id):
    data = request.get_json()

    dateFromRequest = data.get('date')

    if dateFromRequest:
        dateFromRequest = datetime.strptime(dateFromRequest, '%Y-%m-%dT%H:%M:%S')
    else:
        dateFromRequest = datetime.now()

    new_healthstat = HealthStat(
        point_id=point_id
        , medicalDemographic=data.get('medicalDemographic')
        , morbidity=data.get('morbidity')
        , disability=data.get('disability')
        , physicalDevelopment=data.get('physicalDevelopment')
        , date=dateFromRequest
    )
    db.session.add(new_healthstat)
    db.session.commit()
    return jsonify(new_healthstat.to_dict()), 201

@healthstat.route('/points/<int:point_id>/healthstat', methods=['GET'])
def get_healthstat_for_point(point_id):
    healthstats = HealthStat.query.filter_by(point_id=point_id).all()
    return jsonify([healthstat.to_dict() for healthstat in healthstats])

@healthstat.route('/points/<int:point_id>/healthstat/<int:healthstat_id>', methods=['PUT'])
def update_healthstat_for_point(point_id, healthstat_id):
    healthstat = HealthStat.query.filter_by(point_id=point_id, id=healthstat_id).first_or_404()
    data = request.get_json()
    healthstat.medicalDemographic = data.get('medicalDemographic', healthstat.medicalDemographic)
    healthstat.morbidity = data.get('morbidity', healthstat.morbidity)
    healthstat.disability = data.get('disability', healthstat.disability)
    healthstat.physicalDevelopment = data.get('physicalDevelopment', healthstat.physicalDevelopment)
    healthstat.date = datetime.now()
    db.session.commit()
    return jsonify(healthstat.to_dict())

@healthstat.route('/points/<int:point_id>/healthstat/<int:healthstat_id>', methods=['DELETE'])
def delete_healthstat_for_point(point_id, healthstat_id):
    healthstat = HealthStat.query.filter_by(point_id=point_id, id=healthstat_id).first_or_404()
    db.session.delete(healthstat)
    db.session.commit()
    return jsonify({'message': 'healthstat deleted'})