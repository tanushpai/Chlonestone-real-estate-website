# Rental Yield Calculation Guide

This document outlines the formulas and calculations used to compute return on investment (ROI) metrics in the Rental Yield Calculator.

---

## Input Variables

| Variable Name | Symbol | Description | Example Value |
| :--- | :---: | :--- | :--- |
| **Property Price** | $P$ | The purchase price of the property in AED. | AED 2,000,000 |
| **Annual Rent** | $R$ | The projected or actual annual rent collected in AED. | AED 150,000 |
| **Property Size** | $S$ | The size of the property in Square Feet (SqFt). | 1,000 SqFt |
| **Service Charge** | $C$ | The maintenance fee rate charged per SqFt annually (AED/SqFt). | AED 15 / SqFt |

---

## Calculations & Formulas

### 1. Gross Rent Income
The total gross revenue generated from renting out the property per year.
$$\text{Gross Rent Income} = R$$
* **Example**: $\text{AED } 150,000 \text{ / year}$

---

### 2. Gross Yield (Pre-Expense Return)
The rate of return on the property investment before any operational and maintenance expenses are deducted.
$$\text{Gross Yield (\%)} = \left( \frac{\text{Gross Rent Income}}{P} \right) \times 100$$
* **Example**: $\left( \frac{150,000}{2,000,000} \right) \times 100 = 7.50\%$

---

### 3. Estimated Annual Service Charges
The yearly cost incurred for building upkeep, facilities maintenance, and community management.
$$\text{Est. Annual Service Charges} = S \times C$$
* **Example**: $1,000 \text{ SqFt} \times \text{AED } 15 \text{ / SqFt} = \text{AED } 15,000 \text{ / year}$

---

### 4. Net Rent Income
The net revenue remaining after deducting community service charges from the gross rental income.
$$\text{Net Rent Income} = \text{Gross Rent Income} - \text{Est. Annual Service Charges}$$
* **Example**: $\text{AED } 150,000 - \text{AED } 15,000 = \text{AED } 135,000 \text{ / year}$

---

### 5. Net Yield (Post-Expense Return / Net ROI)
The true percentage return on the property investment, taking recurring maintenance costs into account.
$$\text{Net Yield (\%)} = \left( \frac{\text{Net Rent Income}}{P} \right) \times 100$$
* **Example**: $\left( \frac{135,000}{2,000,000} \right) \times 100 = 6.75\%$
