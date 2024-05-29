from flask import Blueprint, jsonify, request

from .models import Documentation
from . import db


documentation = Blueprint('documentation', __name__)


@documentation.route('/documentations', methods=['POST'])
def create_point():
    data = request.get_json()
    new_point = Documentation(
        action=data['action']
        , document=data['document']
        , classes=data['classes']
        , price=data['price']
    )
    db.session.add(new_point)
    db.session.commit()
    return jsonify(new_point.to_dict()), 201

# Get all Points
@documentation.route('/documentations', methods=['GET'])
def get_documentations():
    classes = request.args.get("classes", type=str)
    if not classes:
        query = db.session.query(Documentation)
        documentations = query.all()
        return jsonify([documentation.to_dict() for documentation in documentations])
    query = db.session.query(Documentation)
    documentations = query.filter(Documentation.classes == classes).all()

    return jsonify([documentation.to_dict() for documentation in documentations])

# Update a Point
@documentation.route('/documentations/<int:id>', methods=['PUT'])
def update_documentation(id):
    documentation = Documentation.query.get_or_404(id)
    data = request.get_json()
    documentation.action = data.get('action', documentation.action)
    documentation.document = data.get('document', documentation.document)
    documentation.classes = data.get('classes', documentation.classes)
    documentation.price = data.get('price', documentation.price)
    db.session.commit()
    return jsonify(documentation)

# Delete a Point
@documentation.route('/documentations/<int:id>', methods=['DELETE'])
def delete_documentation(id):
    documentation = Documentation.query.get_or_404(id)
    db.session.delete(documentation)
    db.session.commit()
    return jsonify({'message': 'Documentation deleted'})