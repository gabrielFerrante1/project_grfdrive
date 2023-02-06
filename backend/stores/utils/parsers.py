def p_bool(v) -> bool:
    if v in ['True', 'true', '1']:
        return True
    
    return False