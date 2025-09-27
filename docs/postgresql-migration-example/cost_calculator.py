#!/usr/bin/env python3
"""
Cost Calculator for Database Options
Compares Firebase/Firestore vs PostgreSQL hosting costs
"""

import argparse


class DatabaseCostCalculator:
    """Calculate and compare database hosting costs"""
    
    def __init__(self):
        # Firebase pricing (per 100K operations)
        self.firestore_read_cost = 0.06  # $0.06 per 100K reads
        self.firestore_write_cost = 0.18  # $0.18 per 100K writes
        self.firestore_delete_cost = 0.02  # $0.02 per 100K deletes
        self.firestore_storage_cost = 0.18  # $0.18 per GB/month
        self.firestore_network_cost = 0.12  # $0.12 per GB (after 1GB free daily)
        
        # VM hosting options (monthly costs)
        self.vm_options = {
            'gcp_compute_micro': {
                'name': 'GCP Compute Engine e2-micro',
                'vm_cost': 6.11,
                'storage_cost': 3.40,  # 20GB SSD
                'backup_cost': 1.50,
                'network_free_gb': 1,
                'network_cost_per_gb': 0.12
            },
            'gcp_cloud_sql': {
                'name': 'GCP Cloud SQL db-f1-micro',
                'vm_cost': 7.67,
                'storage_cost': 4.00,  # 20GB SSD
                'backup_cost': 1.00,
                'network_free_gb': 1,
                'network_cost_per_gb': 0.12
            },
            'digitalocean': {
                'name': 'DigitalOcean Basic Droplet',
                'vm_cost': 6.00,
                'storage_cost': 2.50,  # 25GB SSD
                'backup_cost': 1.20,
                'network_free_gb': 1,
                'network_cost_per_gb': 0.01  # Lower egress costs
            }
        }
    
    def calculate_firestore_cost(self, reads_per_month, writes_per_month, deletes_per_month, 
                                storage_gb, network_gb):
        """Calculate monthly Firestore costs"""
        read_cost = (reads_per_month / 100000) * self.firestore_read_cost
        write_cost = (writes_per_month / 100000) * self.firestore_write_cost
        delete_cost = (deletes_per_month / 100000) * self.firestore_delete_cost
        storage_cost = storage_gb * self.firestore_storage_cost
        
        # Network: 1GB free per day (30GB free per month)
        network_billable = max(0, network_gb - 30)
        network_cost = network_billable * self.firestore_network_cost
        
        total = read_cost + write_cost + delete_cost + storage_cost + network_cost
        
        return {
            'reads': read_cost,
            'writes': write_cost,
            'deletes': delete_cost,
            'storage': storage_cost,
            'network': network_cost,
            'total': total
        }
    
    def calculate_vm_cost(self, vm_option, network_gb):
        """Calculate monthly VM hosting costs"""
        option = self.vm_options[vm_option]
        
        base_cost = option['vm_cost'] + option['storage_cost'] + option['backup_cost']
        
        # Network costs
        network_billable = max(0, network_gb - option['network_free_gb'])
        network_cost = network_billable * option['network_cost_per_gb']
        
        total = base_cost + network_cost
        
        return {
            'name': option['name'],
            'vm': option['vm_cost'],
            'storage': option['storage_cost'],
            'backup': option['backup_cost'],
            'network': network_cost,
            'total': total
        }
    
    def compare_costs(self, usage_scenario):
        """Compare costs for a usage scenario"""
        firestore = self.calculate_firestore_cost(**usage_scenario)
        
        vm_costs = {}
        for vm_option in self.vm_options:
            vm_costs[vm_option] = self.calculate_vm_cost(vm_option, usage_scenario['network_gb'])
        
        return firestore, vm_costs
    
    def print_comparison(self, scenario_name, usage_scenario):
        """Print detailed cost comparison"""
        print(f"\n{'='*60}")
        print(f"COST COMPARISON: {scenario_name.upper()}")
        print(f"{'='*60}")
        
        print(f"\nUsage scenario:")
        print(f"  • Reads per month: {usage_scenario['reads_per_month']:,}")
        print(f"  • Writes per month: {usage_scenario['writes_per_month']:,}")
        print(f"  • Deletes per month: {usage_scenario['deletes_per_month']:,}")
        print(f"  • Storage: {usage_scenario['storage_gb']:.1f} GB")
        print(f"  • Network transfer: {usage_scenario['network_gb']:.1f} GB")
        
        firestore, vm_costs = self.compare_costs(usage_scenario)
        
        # Firestore breakdown
        print(f"\n📊 FIREBASE/FIRESTORE:")
        print(f"  • Read operations: ${firestore['reads']:.2f}")
        print(f"  • Write operations: ${firestore['writes']:.2f}")
        print(f"  • Delete operations: ${firestore['deletes']:.2f}")
        print(f"  • Storage: ${firestore['storage']:.2f}")
        print(f"  • Network transfer: ${firestore['network']:.2f}")
        print(f"  • TOTAL per month: ${firestore['total']:.2f}")
        print(f"  • TOTAL per year: ${firestore['total']*12:.2f}")
        
        # VM options
        print(f"\n🖥️  POSTGRESQL VM OPTIONS:")
        
        for vm_key, vm_data in vm_costs.items():
            print(f"\n  {vm_data['name']}:")
            print(f"    • VM/Instance: ${vm_data['vm']:.2f}")
            print(f"    • Storage: ${vm_data['storage']:.2f}")
            print(f"    • Backup: ${vm_data['backup']:.2f}")
            print(f"    • Network: ${vm_data['network']:.2f}")
            print(f"    • TOTAL per month: ${vm_data['total']:.2f}")
            print(f"    • TOTAL per year: ${vm_data['total']*12:.2f}")
            
            # Compare to Firestore
            monthly_diff = vm_data['total'] - firestore['total']
            yearly_diff = monthly_diff * 12
            if monthly_diff > 0:
                print(f"    • More expensive than Firestore: ${monthly_diff:.2f}/month (${yearly_diff:.2f}/year)")
            else:
                print(f"    • Less expensive than Firestore: ${abs(monthly_diff):.2f}/month (${abs(yearly_diff):.2f}/year)")
    
    def management_time_analysis(self):
        """Print management time analysis"""
        print(f"\n{'='*60}")
        print(f"MANAGEMENT TIME ANALYSIS")
        print(f"{'='*60}")
        
        print(f"\n📱 Firebase/Firestore Management:")
        print(f"  • Weekly tasks: ~0.5 hours")
        print(f"    - Monitor usage and costs")
        print(f"    - Review security rules")
        print(f"  • Monthly tasks: ~1 hour")
        print(f"    - Query optimization review")
        print(f"    - Cost analysis")
        print(f"  • TOTAL: ~2-4 hours/month")
        print(f"  • Hourly cost (at $50/hour): $100-200/month")
        
        print(f"\n🖥️  VM PostgreSQL Management:")
        print(f"  • Daily monitoring: ~15 min/day = 7.5 hours/month")
        print(f"  • Weekly maintenance: ~2 hours/week = 8 hours/month")
        print(f"  • Monthly updates: ~4 hours/month")
        print(f"  • Quarterly tasks: ~3 hours/month (averaged)")
        print(f"  • TOTAL: ~22-25 hours/month")
        print(f"  • Hourly cost (at $50/hour): $1100-1250/month")
        
        print(f"\n💡 Management Cost Impact:")
        print(f"  PostgreSQL requires ~20 additional hours/month")
        print(f"  At $50/hour: $1000/month additional management cost")
        print(f"  At $25/hour: $500/month additional management cost")
        print(f"  This far exceeds the ~$5-10/month infrastructure cost difference!")


def main():
    calculator = DatabaseCostCalculator()
    
    # Define usage scenarios
    scenarios = {
        'current_small': {
            'reads_per_month': 500000,
            'writes_per_month': 50000,
            'deletes_per_month': 5000,
            'storage_gb': 0.1,
            'network_gb': 5
        },
        'medium_growth': {
            'reads_per_month': 2000000,
            'writes_per_month': 200000,
            'deletes_per_month': 20000,
            'storage_gb': 0.5,
            'network_gb': 20
        },
        'large_municipal': {
            'reads_per_month': 10000000,
            'writes_per_month': 1000000,
            'deletes_per_month': 100000,
            'storage_gb': 2.0,
            'network_gb': 100
        }
    }
    
    # Print all scenarios
    for scenario_name, usage_scenario in scenarios.items():
        calculator.print_comparison(scenario_name, usage_scenario)
    
    # Management time analysis
    calculator.management_time_analysis()
    
    print(f"\n{'='*60}")
    print(f"RECOMMENDATION")
    print(f"{'='*60}")
    print(f"\nFor ReciclApp (current small scale):")
    print(f"✅ Stick with Firebase/Firestore")
    print(f"   - Lower infrastructure costs")
    print(f"   - Dramatically lower management overhead")
    print(f"   - Better developer productivity")
    print(f"   - Proven reliability and scaling")
    print(f"\n❌ Avoid PostgreSQL VM unless:")
    print(f"   - Complex SQL queries are essential")
    print(f"   - Monthly Firebase costs exceed $50+")
    print(f"   - You have dedicated DevOps resources")
    print(f"   - Compliance requires specific database features")


if __name__ == '__main__':
    main()