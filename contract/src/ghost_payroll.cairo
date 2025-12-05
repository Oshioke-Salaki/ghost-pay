use starknet::ContractAddress;

#[derive(Drop, Serde, starknet::Store)]
struct Employee {
    employee_address: ContractAddress,
    salary: u256,
}

#[starknet::interface]
trait IGhostPayroll<TContractState> {
    // --- Write Functions (Any Employer) ---
    fn add_employee(ref self: TContractState, employee_addr: ContractAddress, salary: u256);
    fn remove_employee(ref self: TContractState, employee_addr: ContractAddress);
    fn update_salary(ref self: TContractState, employee_addr: ContractAddress, new_salary: u256);

    // --- Read Functions ---
    fn get_employees(self: @TContractState, employer_addr: ContractAddress) -> Array<Employee>;
    fn get_total_payroll(self: @TContractState, employer_addr: ContractAddress) -> u256;
    fn get_total_employees(self: @TContractState, employer_addr: ContractAddress) -> u64;
    fn is_employee(self: @TContractState, employer_addr: ContractAddress, employee_addr: ContractAddress) -> bool;
}

#[starknet::contract]
mod GhostPayroll {
    use starknet::{ContractAddress, get_caller_address};
    use super::{IGhostPayroll, Employee};

    // --- Storage ---
    #[storage]
    struct Storage {
        // Core Array Simulation: (Employer, Index) -> Employee Struct
        employees: LegacyMap::<(ContractAddress, u64), Employee>,
        
        // Count: Employer -> Number of Employees
        employee_count: LegacyMap::<ContractAddress, u64>,

        // Lookup Optimization: (Employer, EmployeeAddress) -> Array Index (1-based to allow 0 check)
        // We use 1-based indexing for this map so 0 means "not found"
        employee_indices: LegacyMap::<(ContractAddress, ContractAddress), u64>,

        // Aggregates: Employer -> Total Salary
        employer_payroll: LegacyMap::<ContractAddress, u256>,
    }

    // --- Events ---
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        EmployeeAdded: EmployeeAdded,
        EmployeeRemoved: EmployeeRemoved,
        SalaryUpdated: SalaryUpdated,
    }

    #[derive(Drop, starknet::Event)]
    struct EmployeeAdded {
        #[key]
        employer: ContractAddress,
        #[key]
        employee: ContractAddress,
        salary: u256
    }

    #[derive(Drop, starknet::Event)]
    struct EmployeeRemoved {
        #[key]
        employer: ContractAddress,
        #[key]
        employee: ContractAddress
    }

    #[derive(Drop, starknet::Event)]
    struct SalaryUpdated {
        #[key]
        employer: ContractAddress,
        #[key]
        employee: ContractAddress,
        old_salary: u256,
        new_salary: u256
    }

    // --- External Functions ---
    #[abi(embed_v0)]
    impl GhostPayrollImpl of IGhostPayroll<ContractState> {
        
        // 1. Add Employee
        fn add_employee(ref self: ContractState, employee_addr: ContractAddress, salary: u256) {
            let employer = get_caller_address();
            
            // Check if exists
            let existing_index = self.employee_indices.read((employer, employee_addr));
            assert(existing_index == 0, 'Employee already exists');
            assert(salary > 0, 'Salary must be > 0');

            // Get current count (which becomes the new 0-based index)
            let current_count = self.employee_count.read(employer);
            
            // Create Struct
            let new_employee = Employee {
                employee_address: employee_addr,
                salary: salary
            };

            // Store in "Array"
            self.employees.write((employer, current_count), new_employee);
            
            // Update Lookup (Store as index + 1)
            self.employee_indices.write((employer, employee_addr), current_count + 1);

            // Update Metrics
            self.employee_count.write(employer, current_count + 1);
            let current_total = self.employer_payroll.read(employer);
            self.employer_payroll.write(employer, current_total + salary);

            self.emit(EmployeeAdded { employer, employee: employee_addr, salary });
        }

        // 2. Remove Employee (Swap and Pop Pattern)
        fn remove_employee(ref self: ContractState, employee_addr: ContractAddress) {
            let employer = get_caller_address();
            
            let index_plus_one = self.employee_indices.read((employer, employee_addr));
            assert(index_plus_one > 0, 'Employee not found');
            let index_to_remove = index_plus_one - 1;

            let current_count = self.employee_count.read(employer);
            let last_index = current_count - 1;

            // Get the employee struct to subtract salary
            let employee_to_remove = self.employees.read((employer, index_to_remove));

            // If the element to remove is NOT the last one, we move the last one to this slot
            if index_to_remove != last_index {
                let last_employee = self.employees.read((employer, last_index));
                
                // Move last employee to the empty slot
                self.employees.write((employer, index_to_remove), last_employee);
                
                // Update the lookup index for the moved employee
                self.employee_indices.write((employer, last_employee.employee_address), index_to_remove + 1);
            }

            // Clean up the last slot (optional in some implementations, but good for cleanliness)
            // We strictly just need to zero out the index lookup and decrement count
            self.employee_indices.write((employer, employee_addr), 0);
            self.employee_count.write(employer, current_count - 1);

            // Update Total Payroll
            let current_total = self.employer_payroll.read(employer);
            self.employer_payroll.write(employer, current_total - employee_to_remove.salary);

            self.emit(EmployeeRemoved { employer, employee: employee_addr });
        }

        // 3. Update Salary
        fn update_salary(ref self: ContractState, employee_addr: ContractAddress, new_salary: u256) {
            let employer = get_caller_address();
            
            let index_plus_one = self.employee_indices.read((employer, employee_addr));
            assert(index_plus_one > 0, 'Employee not found');
            let index = index_plus_one - 1;

            let mut employee = self.employees.read((employer, index));
            let old_salary = employee.salary;

            // Update Struct
            employee.salary = new_salary;
            self.employees.write((employer, index), employee);

            // Update Total
            let current_total = self.employer_payroll.read(employer);
            self.employer_payroll.write(employer, current_total - old_salary + new_salary);

            self.emit(SalaryUpdated { 
                employer,
                employee: employee_addr, 
                old_salary, 
                new_salary 
            });
        }

        // --- View Functions ---

        // Returns the full array of employees for a specific employer
        fn get_employees(self: @ContractState, employer_addr: ContractAddress) -> Array<Employee> {
            let count = self.employee_count.read(employer_addr);
            let mut result_arr = ArrayTrait::new();
            let mut i: u64 = 0;

            loop {
                if i >= count {
                    break;
                }
                let emp = self.employees.read((employer_addr, i));
                result_arr.append(emp);
                i += 1;
            };

            result_arr
        }

        fn get_total_payroll(self: @ContractState, employer_addr: ContractAddress) -> u256 {
            self.employer_payroll.read(employer_addr)
        }

        fn get_total_employees(self: @ContractState, employer_addr: ContractAddress) -> u64 {
            self.employee_count.read(employer_addr)
        }

        fn is_employee(self: @ContractState, employer_addr: ContractAddress, employee_addr: ContractAddress) -> bool {
            let index = self.employee_indices.read((employer_addr, employee_addr));
            index > 0
        }
    }
}