from flask import Blueprint, request, jsonify

from .models import EconomyStat
from . import db
from datetime import datetime

economystat = Blueprint('economystat', __name__)

@economystat.route('/points/<int:point_id>/economystat', methods=['POST'])
def create_economystat_for_point(point_id):
    data = request.get_json()
    
    dateFromRequest = data.get('date')

    if dateFromRequest:
        dateFromRequest = datetime.strptime(dateFromRequest, '%Y-%m-%dT%H:%M:%S')
    else:
        dateFromRequest = datetime.now()

    new_economystat = EconomyStat(
        point_id=point_id
        , gdp=data.get('gdp')
        , freightTraffic=data.get('freightTraffic')
        , passengerTraffic=data.get('passengerTraffic')
        , exportGoods=data.get('exportGoods')
        , date=dateFromRequest
    )
    db.session.add(new_economystat)
    db.session.commit()
    return jsonify(new_economystat.to_dict()), 201

@economystat.route('/points/<int:point_id>/economystat', methods=['GET'])
def get_economystat_for_point(point_id):
    economystats = EconomyStat.query.filter_by(point_id=point_id).all()
    return jsonify([economystat.to_dict() for economystat in economystats])

@economystat.route('/points/<int:point_id>/economystat/<int:economystat_id>', methods=['PUT'])
def update_economystat_for_point(point_id, economystat_id):
    economystat = EconomyStat.query.filter_by(point_id=point_id, id=economystat_id).first_or_404()
    data = request.get_json()
    economystat.gdp = data.get('gdp', economystat.gdp)
    economystat.freightTraffic = data.get('freightTraffic', economystat.freightTraffic)
    economystat.passengerTraffic = data.get('passengerTraffic', economystat.passengerTraffic)
    economystat.exportGoods = data.get('exportGoods', economystat.exportGoods)
    economystat.date = datetime.now()
    db.session.commit()
    return jsonify(economystat.to_dict())

@economystat.route('/points/<int:point_id>/economystat/<int:economystat_id>', methods=['DELETE'])
def delete_economystat_for_point(point_id, economystat_id):
    economystat = EconomyStat.query.filter_by(point_id=point_id, id=economystat_id).first_or_404()
    db.session.delete(economystat)
    db.session.commit()
    return jsonify({'message': 'economystat deleted'})