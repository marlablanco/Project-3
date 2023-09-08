from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float
Base = declarative_base()

class disasters(Base):
    __tablename__ = "disasters"
    fema_declaration_string = Column(String(10), primary_key = True)
    disaster_number = Column(Integer)
    state = Column(String(2))
    declaration_type = Column(String(2))
    declaration_date = Column(Integer)
    fy_declared = Column(Integer)
    incident_type = Column(String(32))
    declaration_title = Column(String(128))
    ih_program_declared = Column(Integer)
    ia_program_declared = Column(Integer)
    pa_program_declared = Column(Integer)
    hm_program_declared = Column(Integer)
    incident_begin_date = Column(Integer)
    incident_end_date = Column(Integer)
    disaster_closeout_date = Column(Integer)
    tribal_request = Column(Integer)
    fips_state_code = Column(Integer)
    fips_county_code = Column(Integer)
    place_code = Column(Integer)
    designated_area = Column(String(64))
    declaration_request_number = Column(Integer)
    last_ia_filing_date = Column(Integer)
    last_refresh = Column(Integer)
    hash = Column(String(40))
    id = Column(String(36))

class temperature_anomalies(Base):
    __tablename__ = "temperature_anomalies"
    year = Column(Integer, primary_key = True)
    month = Column(Integer, primary_key = True)
    Anomaly = Column(Float)

class world_disasters_1970_2021(Base):
    __tablename__ = "world_disasters_1970_2021"
    dis_no = Column(String(14), primary_key = True)
    year = Column(Integer)
    seq = Column(Integer)
    disaster_group = Column(String(30))
    disaster_subgroup = Column(String(30))
    disaster_type = Column(String(30))
    disaster_subtype = Column(String(30))
    country = Column(String(30))
    iso = Column(String(3))
    latitude = Column(Float)
    longitude = Column(Float)
    total_deaths = Column(Float)
    total_damages = Column(Float)
