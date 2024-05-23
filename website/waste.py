from flask import Blueprint, request, jsonify

from .models import Waste
from . import db

waste = Blueprint('waste', __name__)

@waste.route('/points/<int:point_id>/waste', methods=['POST'])
def create_waste_for_point(point_id):
    data = request.get_json()
    new_waste = Waste(
        point_id=point_id, title=data.get('title'), composition=data.get('composition')
    )
    db.session.add(new_waste)
    db.session.commit()
    return jsonify(new_waste.to_dict()), 201

@waste.route('/points/<int:point_id>/waste', methods=['GET'])
def get_waste_for_point(point_id):
    waste = Waste.query.filter_by(point_id=point_id).first_or_404()
    return jsonify(waste.to_dict())

@waste.route('/points/<int:point_id>/waste/<int:waste_id>', methods=['PUT'])
def update_waste_for_point(point_id, waste_id):
    waste = Waste.query.filter_by(point_id=point_id, id=waste_id).first_or_404()
    data = request.get_json()
    waste.title = data.get('title', waste.title)
    waste.composition = data.get('composition', waste.composition)
    db.session.commit()
    return jsonify(waste.to_dict())

@waste.route('/points/<int:point_id>/waste/<int:waste_id>', methods=['DELETE'])
def delete_radiationstat_for_point(point_id, waste_id):
    waste = Waste.query.filter_by(point_id=point_id, id=waste_id).first_or_404()
    db.session.delete(waste)
    db.session.commit()
    return jsonify({'message': 'waste deleted'})