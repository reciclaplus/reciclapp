#!/usr/bin/env python3
"""
Migration script from Firebase/Firestore to PostgreSQL
This script migrates data from your existing Firestore database to PostgreSQL

Requirements:
- Firebase Admin SDK credentials
- PostgreSQL connection
- Both databases accessible

Usage:
    python migration_script.py [--dry-run]
"""

import argparse
import json
import logging
from datetime import datetime
from typing import Dict, List

import firebase_admin
from firebase_admin import credentials, firestore
import psycopg2
from psycopg2.extras import RealDictCursor, execute_values

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class FirestoreToPostgreSQLMigrator:
    """Migrates data from Firestore to PostgreSQL"""
    
    def __init__(self, postgres_config: Dict[str, str], firestore_credentials_path: str):
        self.postgres_config = postgres_config
        self.firestore_credentials_path = firestore_credentials_path
        self.dry_run = False
        
        # Initialize Firebase Admin SDK
        cred = credentials.Certificate(firestore_credentials_path)
        firebase_admin.initialize_app(cred)
        self.firestore_db = firestore.client()
        
        # PostgreSQL connection
        self.pg_conn = None
    
    def connect_postgresql(self):
        """Connect to PostgreSQL database"""
        try:
            self.pg_conn = psycopg2.connect(**self.postgres_config)
            logger.info("Connected to PostgreSQL successfully")
        except Exception as e:
            logger.error(f"Failed to connect to PostgreSQL: {e}")
            raise
    
    def migrate_users(self) -> int:
        """Migrate users collection"""
        logger.info("Starting users migration...")
        
        # Get users from Firestore
        users_ref = self.firestore_db.collection('users')
        users_docs = list(users_ref.stream())
        
        if not users_docs:
            logger.warning("No users found in Firestore")
            return 0
        
        # Prepare data for PostgreSQL
        users_data = []
        for doc in users_docs:
            user_data = doc.to_dict()
            users_data.append((
                user_data.get('email'),
                user_data.get('name', ''),
                user_data.get('picture', ''),
            ))
        
        if self.dry_run:
            logger.info(f"DRY RUN: Would migrate {len(users_data)} users")
            return len(users_data)
        
        # Insert into PostgreSQL
        with self.pg_conn.cursor() as cursor:
            insert_query = """
                INSERT INTO users (email, name, picture) 
                VALUES %s 
                ON CONFLICT (email) DO UPDATE SET
                name = EXCLUDED.name,
                picture = EXCLUDED.picture,
                updated_at = CURRENT_TIMESTAMP
            """
            execute_values(cursor, insert_query, users_data)
            self.pg_conn.commit()
        
        logger.info(f"Successfully migrated {len(users_data)} users")
        return len(users_data)
    
    def migrate_pdr(self) -> int:
        """Migrate PDR (Points of Recycling) collection"""
        logger.info("Starting PDR migration...")
        
        # Get PDR from Firestore
        pdr_ref = self.firestore_db.collection('pdr')
        pdr_docs = list(pdr_ref.stream())
        
        if not pdr_docs:
            logger.warning("No PDR found in Firestore")
            return 0
        
        # Prepare data for PostgreSQL
        pdr_data = []
        for doc in pdr_docs:
            pdr = doc.to_dict()
            pdr_data.append((
                pdr.get('internal_id'),
                pdr.get('nombre', ''),
                pdr.get('descripcion', ''),
                pdr.get('barrio', ''),
                pdr.get('categoria', ''),
                pdr.get('comunidad', ''),
                self._convert_firestore_timestamp(pdr.get('date_added')),
                float(pdr.get('lat', 0)),
                float(pdr.get('lng', 0)),
                pdr.get('active', True)
            ))
        
        if self.dry_run:
            logger.info(f"DRY RUN: Would migrate {len(pdr_data)} PDR records")
            return len(pdr_data)
        
        # Insert into PostgreSQL
        with self.pg_conn.cursor() as cursor:
            insert_query = """
                INSERT INTO pdr (internal_id, nombre, descripcion, barrio, categoria, comunidad, date_added, lat, lng, active) 
                VALUES %s 
                ON CONFLICT (internal_id) DO UPDATE SET
                nombre = EXCLUDED.nombre,
                descripcion = EXCLUDED.descripcion,
                barrio = EXCLUDED.barrio,
                categoria = EXCLUDED.categoria,
                comunidad = EXCLUDED.comunidad,
                lat = EXCLUDED.lat,
                lng = EXCLUDED.lng,
                active = EXCLUDED.active,
                updated_at = CURRENT_TIMESTAMP
            """
            execute_values(cursor, insert_query, pdr_data)
            self.pg_conn.commit()
        
        logger.info(f"Successfully migrated {len(pdr_data)} PDR records")
        return len(pdr_data)
    
    def migrate_recogida(self) -> int:
        """Migrate recogida (collection) records"""
        logger.info("Starting recogida migration...")
        
        # Get recogida from Firestore
        recogida_ref = self.firestore_db.collection('recogida')
        recogida_docs = list(recogida_ref.stream())
        
        if not recogida_docs:
            logger.warning("No recogida records found in Firestore")
            return 0
        
        # Prepare data for PostgreSQL
        recogida_data = []
        for doc in recogida_docs:
            recogida = doc.to_dict()
            recogida_data.append((
                recogida.get('pdr_internal_id'),
                recogida.get('year'),
                recogida.get('week'),
                recogida.get('wasCollected', 'no'),
                float(recogida.get('weight', 0)) if recogida.get('weight') else None,
                recogida.get('notes', ''),
                recogida.get('collected_by', ''),
                self._convert_firestore_timestamp(recogida.get('collection_date'))
            ))
        
        if self.dry_run:
            logger.info(f"DRY RUN: Would migrate {len(recogida_data)} recogida records")
            return len(recogida_data)
        
        # Insert into PostgreSQL
        with self.pg_conn.cursor() as cursor:
            insert_query = """
                INSERT INTO recogida (pdr_internal_id, year, week, was_collected, weight, notes, collected_by, collection_date) 
                VALUES %s 
                ON CONFLICT (pdr_internal_id, year, week) DO UPDATE SET
                was_collected = EXCLUDED.was_collected,
                weight = EXCLUDED.weight,
                notes = EXCLUDED.notes,
                collected_by = EXCLUDED.collected_by,
                collection_date = EXCLUDED.collection_date,
                updated_at = CURRENT_TIMESTAMP
            """
            execute_values(cursor, insert_query, recogida_data)
            self.pg_conn.commit()
        
        logger.info(f"Successfully migrated {len(recogida_data)} recogida records")
        return len(recogida_data)
    
    def migrate_pdr_logs(self) -> int:
        """Migrate PDR logs"""
        logger.info("Starting PDR logs migration...")
        
        # Get logs from Firestore
        logs_ref = self.firestore_db.collection('pdr_logs')
        logs_docs = list(logs_ref.stream())
        
        if not logs_docs:
            logger.warning("No PDR logs found in Firestore")
            return 0
        
        # Prepare data for PostgreSQL
        logs_data = []
        for doc in logs_docs:
            log = doc.to_dict()
            logs_data.append((
                log.get('action', ''),
                log.get('pdr', {}).get('internal_id') if log.get('pdr') else None,
                json.dumps(log.get('pdr', {})),
                log.get('user_email', ''),
                self._convert_firestore_timestamp(log.get('timestamp'))
            ))
        
        if self.dry_run:
            logger.info(f"DRY RUN: Would migrate {len(logs_data)} log records")
            return len(logs_data)
        
        # Insert into PostgreSQL
        with self.pg_conn.cursor() as cursor:
            # First, get pdr_id based on internal_id
            insert_query = """
                INSERT INTO pdr_logs (action, pdr_id, pdr_data, user_email, timestamp) 
                SELECT %s, pdr.id, %s::jsonb, %s, %s
                FROM pdr 
                WHERE pdr.internal_id = %s
                UNION ALL
                SELECT %s, NULL, %s::jsonb, %s, %s
                WHERE %s IS NULL
            """
            
            for log_data in logs_data:
                action, pdr_internal_id, pdr_json, user_email, timestamp = log_data
                cursor.execute(insert_query, (
                    action, pdr_json, user_email, timestamp, pdr_internal_id,
                    action, pdr_json, user_email, timestamp, pdr_internal_id
                ))
            
            self.pg_conn.commit()
        
        logger.info(f"Successfully migrated {len(logs_data)} log records")
        return len(logs_data)
    
    def _convert_firestore_timestamp(self, timestamp):
        """Convert Firestore timestamp to Python datetime"""
        if timestamp is None:
            return None
        if hasattr(timestamp, 'to_pydatetime'):
            return timestamp.to_pydatetime()
        return timestamp
    
    def run_migration(self, dry_run: bool = False):
        """Run the complete migration"""
        self.dry_run = dry_run
        
        if dry_run:
            logger.info("Running in DRY RUN mode - no data will be modified")
        
        try:
            self.connect_postgresql()
            
            # Run migrations
            users_count = self.migrate_users()
            pdr_count = self.migrate_pdr()
            recogida_count = self.migrate_recogida()
            logs_count = self.migrate_pdr_logs()
            
            logger.info("Migration completed successfully!")
            logger.info(f"Summary:")
            logger.info(f"  Users: {users_count}")
            logger.info(f"  PDR: {pdr_count}")
            logger.info(f"  Recogida: {recogida_count}")
            logger.info(f"  Logs: {logs_count}")
            
        except Exception as e:
            logger.error(f"Migration failed: {e}")
            raise
        finally:
            if self.pg_conn:
                self.pg_conn.close()


def main():
    parser = argparse.ArgumentParser(description='Migrate data from Firestore to PostgreSQL')
    parser.add_argument('--dry-run', action='store_true', help='Run migration in dry-run mode')
    parser.add_argument('--postgres-host', default='localhost', help='PostgreSQL host')
    parser.add_argument('--postgres-port', default='5432', help='PostgreSQL port')
    parser.add_argument('--postgres-db', default='reciclapp', help='PostgreSQL database name')
    parser.add_argument('--postgres-user', default='reciclapp_user', help='PostgreSQL username')
    parser.add_argument('--postgres-password', default='reciclapp_secure_password_2024', help='PostgreSQL password')
    parser.add_argument('--firestore-credentials', default='./routers/firestore-service-account.json', help='Path to Firestore service account JSON')
    
    args = parser.parse_args()
    
    # PostgreSQL configuration
    postgres_config = {
        'host': args.postgres_host,
        'port': args.postgres_port,
        'database': args.postgres_db,
        'user': args.postgres_user,
        'password': args.postgres_password,
    }
    
    # Run migration
    migrator = FirestoreToPostgreSQLMigrator(postgres_config, args.firestore_credentials)
    migrator.run_migration(dry_run=args.dry_run)


if __name__ == '__main__':
    main()