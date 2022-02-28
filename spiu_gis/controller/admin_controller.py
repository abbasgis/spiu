# f'{n:03}'
def generate_unique_code(district_code, category_code, industry_code):
    category_code = f'{category_code:03}'
    industry_code = f'{industry_code:04}'
    code = district_code + '-' + str(category_code) + '-' + str(industry_code)
    return code
