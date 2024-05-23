from flask import Blueprint, request, jsonify

from .models import Waste
from . import db
from datetime import datetime

waste = Blueprint('waste', __name__)

@waste.route('/points/<int:point_id>/waste', methods=['POST'])
def create_waste_for_point(point_id):
    data = request.get_json()
    new_waste = Waste(
        point_id=point_id
        , paper=data.get('paper')
        , plastic=data.get('plastic')
        , metal=data.get('metal')
        , product=data.get('product')
        , date=datetime.now()
    )
    db.session.add(new_waste)
    db.session.commit()
    return jsonify(new_waste.to_dict()), 201

@waste.route('/points/<int:point_id>/waste', methods=['GET'])
def get_waste_for_point(point_id):
    wastes = Waste.query.filter_by(point_id=point_id).all()
    return jsonify([waste.to_dict() for waste in wastes])

@waste.route('/points/<int:point_id>/waste/<int:waste_id>', methods=['PUT'])
def update_waste_for_point(point_id, waste_id):
    waste = Waste.query.filter_by(point_id=point_id, id=waste_id).first_or_404()
    data = request.get_json()
    waste.paper = data.get('paper', waste.paper)
    waste.plastic = data.get('plastic', waste.plastic)
    waste.metal = data.get('metal', waste.metal)
    waste.product = data.get('product', waste.product)
    waste.date = datetime.now()
    db.session.commit()
    return jsonify(waste.to_dict())

@waste.route('/points/<int:point_id>/waste/<int:waste_id>', methods=['DELETE'])
def delete_radiationstat_for_point(point_id, waste_id):
    waste = Waste.query.filter_by(point_id=point_id, id=waste_id).first_or_404()
    db.session.delete(waste)
    db.session.commit()
    return jsonify({'message': 'waste deleted'})