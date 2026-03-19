# Backend Test Guide

## Main command

Run the whole backend suite:

```bash
python -m unittest discover -s tests
```

## Suggested order

1. Fast smoke checks

```bash
python app/test_db.py
python app/test_models.py
```

2. Full unit suite

```bash
python -m unittest discover -s tests
```

## What each group covers

- `test_security.py`: password hashing and token generation
- `test_auth_service.py`: login rules and legacy password rehash
- `test_catalog_service.py`: categories CRUD/service rules
- `test_course_service.py`: courses validation and soft delete
- `test_video_service.py`: videos validation and soft delete
- `test_content_access_service.py`: purchased-content access rules
- `test_storage_service.py`: uploaded video file persistence
- `test_learning_service.py`: purchases, progress and student dashboard logic
- `test_checkout_service.py`: cart checkout behavior
- `test_community_service.py`: commentary permissions for buyers
- `test_health.py`: app health handler and route registration
