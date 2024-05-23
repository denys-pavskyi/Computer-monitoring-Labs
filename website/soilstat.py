from flask import Blueprint, request, jsonify

from .models import SoilStat
from . import db

soilstat = Blueprint('soilstat', __name__)

@soilstat.route('/points/<int:point_id>/soilstat', methods=['POST'])
def create_soilstat_for_point(point_id):
    data = request.get_json()
    new_soilstat = SoilStat(
        point_id=point_id, humus=data.get('humus'), p2o5=data.get('p2o5'),k20=data.get('k20'),
        salinity=data.get('salinity'), chemPoll=data.get('chemPoll'), pH=data.get('pH')
    )
    db.session.add(new_soilstat)
    db.session.commit()
    return jsonify(new_soilstat.to_dict()), 201

@soilstat.route('/points/<int:point_id>/soilstat', methods=['GET'])
def get_soilstat_for_point(point_id):
    soilstat = SoilStat.query.filter_by(point_id=point_id).first_or_404()
    return jsonify(soilstat.to_dict())

@soilstat.route('/points/<int:point_id>/soilstat/<int:soilstat_id>', methods=['PUT'])
def update_soilstat_for_point(point_id, soilstat_id):
    soilstat = SoilStat.query.filter_by(point_id=point_id, id=soilstat_id).first_or_404()
    data = request.get_json()
    soilstat.humus = data.get('humus', soilstat.humus)
    soilstat.p2o5 = data.get('p2o5', soilstat.p2o5)
    soilstat.k20 = data.get('k20', soilstat.k20)
    soilstat.salinity = data.get('salinity', soilstat.salinity)
    soilstat.chemPoll = data.get('chemPoll', soilstat.chemPoll)
    soilstat.pH = data.get('pH', soilstat.pH)
    db.session.commit()
    return jsonify(soilstat.to_dict())

@soilstat.route('/points/<int:point_id>/soilstat/<int:soilstat_id>', methods=['DELETE'])
def delete_soilstat_for_point(point_id, soilstat_id):
    soilstat = SoilStat.query.filter_by(point_id=point_id, id=soilstat_id).first_or_404()
    db.session.delete(soilstat)
    db.session.commit()
    return jsonify({'message': 'soilstat deleted'})