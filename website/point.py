from flask import Blueprint, jsonify, request

from .models import Point, AirStat, WaterStat, SoilStat, RadiationStat, Waste, EconomyStat, HealthStat, EnergyStat
from . import db


point = Blueprint('point', __name__)


@point.route('/points', methods=['POST'])
def create_point():
    data = request.get_json()
    new_point = Point(title=data['title'], cord1=data['cord1'], cord2=data['cord2'])
    db.session.add(new_point)
    db.session.commit()
    return jsonify(new_point.to_dict()), 201

# Get all Points
@point.route('/points', methods=['GET'])
def get_points():
    airstat_filter = request.args.get("airstat", type=bool)
    waterstat_filter = request.args.get("waterstat", type=bool)
    soilstat_filter = request.args.get("soilstat", type=bool)
    radiationstat_filter = request.args.get("radiationstat", type=bool)
    waste_filter = request.args.get("waste", type=bool)
    economyStat_filter = request.args.get("economyStat", type=bool)
    healthStat_filter = request.args.get("healthStat", type=bool)
    energyStat_filter = request.args.get("energyStat", type=bool)
    query = db.session.query(Point)

    print(airstat_filter)
    if airstat_filter:
        query = query.join(AirStat, Point.id == AirStat.point_id)
    if waterstat_filter:
        query = query.join(WaterStat, Point.id == WaterStat.point_id)
    if soilstat_filter:
        query = query.join(SoilStat, Point.id == SoilStat.point_id)
    if radiationstat_filter:
        query = query.join(RadiationStat, Point.id == RadiationStat.point_id)
    if waste_filter:
        query = query.join(Waste, Point.id == Waste.point_id)
    if economyStat_filter:
        query = query.join(EconomyStat, Point.id == EconomyStat.point_id)
    if healthStat_filter:
        query = query.join(HealthStat, Point.id == HealthStat.point_id)
    if energyStat_filter:
        query = query.join(EnergyStat, Point.id == EnergyStat.point_id)
    points = query.all()
    return jsonify([point.to_dict() for point in points])

# Get a specific Point
@point.route('/points/<int:id>', methods=['GET'])
def get_point(id):
    point = Point.query.get_or_404(id)
    return jsonify(point)

# Update a Point
@point.route('/points/<int:id>', methods=['PUT'])
def update_point(id):
    point = Point.query.get_or_404(id)
    data = request.get_json()
    point.title = data.get('title', point.title)
    point.cord1 = data.get('cord1', point.cord1)
    point.cord2 = data.get('cord2', point.cord2)
    db.session.commit()
    return jsonify(point)

# Delete a Point
@point.route('/points/<int:id>', methods=['DELETE'])
def delete_point(id):
    point = Point.query.get_or_404(id)
    db.session.delete(point)
    db.session.commit()
    return jsonify({'message': 'Point deleted'})