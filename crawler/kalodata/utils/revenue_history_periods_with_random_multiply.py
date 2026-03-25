from utils.random_multiply import random_multiply

def revenue_history_periods_with_random_multiply(revenue_trend):
    revenue_history = [round(random_multiply(float(value)), 2) for value in revenue_trend]
        
    revenue_history_14_days = None
    if len(revenue_history) > 14:
         revenue_history_14_days = revenue_history[:14]

    revenue_history_7_days = None
    if len(revenue_history) > 7:
        revenue_history_7_days = revenue_history[:7]

    revenue_14_days = sum(revenue_history_14_days)
    revenue_7_days = sum(revenue_history_7_days)

    return revenue_14_days, revenue_7_days, revenue_history, revenue_history_14_days, revenue_history_7_days