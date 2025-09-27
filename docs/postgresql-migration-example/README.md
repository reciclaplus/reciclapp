# PostgreSQL Migration Example

This directory contains example implementations showing how to migrate from Firebase/Firestore to PostgreSQL.

## Files

- `docker-compose.yml` - PostgreSQL setup with Docker
- `postgresql_models.py` - SQLAlchemy models equivalent to Firestore collections  
- `migration_script.py` - Data migration from Firestore to PostgreSQL
- `dependencies_postgresql.py` - Updated FastAPI dependencies for PostgreSQL
- `setup.sql` - Database schema initialization

## Quick Start

1. **Start PostgreSQL with Docker:**
   ```bash
   cd docs/postgresql-migration-example
   docker-compose up -d
   ```

2. **Initialize database:**
   ```bash
   psql -h localhost -p 5432 -U reciclapp_user -d reciclapp -f setup.sql
   ```

3. **Run migration (if coming from Firestore):**
   ```bash
   python migration_script.py
   ```

4. **Update FastAPI code to use PostgreSQL models**

## Cost Comparison

Running this PostgreSQL setup:

### Local Development (Docker)
- **Cost**: $0 (uses local resources)
- **Management**: Manual container management

### Production VM Deployment
- **Monthly cost**: $9.70-$12.75 depending on provider
- **Management**: 10-20 hours/month operational tasks
- **Benefits**: Full SQL capabilities, better for complex queries

### Current Firebase/Firestore
- **Monthly cost**: ~$4.40
- **Management**: 2-4 hours/month
- **Benefits**: Zero operational overhead, automatic scaling