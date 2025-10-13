-- load_csvs.sql
-- Run this script inside psql connected to ontopdb as ontopuser

-- 1. lang_description_aliases.csv
DROP TABLE IF EXISTS lang_description_aliases;
CREATE TABLE lang_description_aliases (
    subject TEXT,
    language TEXT,
    description TEXT,
    alias TEXT
);
\copy lang_description_aliases FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/lang_description_aliases.csv' DELIMITER ',' CSV HEADER;

-- 2. described_by_source.csv
DROP TABLE IF EXISTS described_by_source;
CREATE TABLE described_by_source (
    subject_q TEXT,
    subject TEXT,
    object_q TEXT,
    object TEXT,
    instance_of_q TEXT,
    instance_of TEXT
);
\copy described_by_source FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/described_by_source.csv' DELIMITER ',' CSV HEADER;

-- 3. located_in_the_administrative_territorial_entity.csv
DROP TABLE IF EXISTS located_in_the_administrative_territorial_entity;
CREATE TABLE located_in_the_administrative_territorial_entity (
    subject_q TEXT,
    subject TEXT,
    object_q TEXT,
    object TEXT,
    instance_of_q TEXT,
    instance_of TEXT
);
\copy located_in_the_administrative_territorial_entity FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/located_in_the_administrative_territorial_entity.csv' DELIMITER ',' CSV HEADER;

-- 4. named_after.csv
DROP TABLE IF EXISTS named_after;
CREATE TABLE named_after (
    subject_q TEXT,
    subject TEXT,
    object_q TEXT,
    object TEXT,
    instance_of_q TEXT,
    instance_of TEXT
);
\copy named_after FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/named_after.csv' DELIMITER ',' CSV HEADER;

-- 5. location.csv
DROP TABLE IF EXISTS location;
CREATE TABLE location (
    subject_q TEXT,
    subject TEXT,
    object_q TEXT,
    object TEXT,
    instance_of_q TEXT,
    instance_of TEXT
);
\copy location FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/location.csv' DELIMITER ',' CSV HEADER;

-- 6. diocese.csv
DROP TABLE IF EXISTS diocese;
CREATE TABLE diocese (
    subject_q TEXT,
    subject TEXT,
    object_q TEXT,
    object TEXT,
    instance_of_q TEXT,
    instance_of TEXT
);
\copy diocese FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/diocese.csv' DELIMITER ',' CSV HEADER;

-- 7. feast_day.csv
DROP TABLE IF EXISTS feast_day;
CREATE TABLE feast_day (
    subject_q TEXT,
    subject TEXT,
    object_q TEXT,
    object TEXT,
    instance_of_q TEXT,
    instance_of TEXT
);
\copy feast_day FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/feast_day.csv' DELIMITER ',' CSV HEADER;

-- 8. inventory_id_coll.csv
DROP TABLE IF EXISTS inventory_id_coll;
CREATE TABLE inventory_id_coll (
    subject_q TEXT,
    inventory_id TEXT,
    collection_q TEXT,
    collection_label TEXT
);
\copy inventory_id_coll FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/inventory_id_coll.csv' DELIMITER ',' CSV HEADER;

-- 9. mouth_of_watercourse.csv
DROP TABLE IF EXISTS mouth_of_watercourse;
CREATE TABLE mouth_of_watercourse (
    subject_q TEXT,
    subject TEXT,
    object_q TEXT,
    object TEXT,
    instance_of_q TEXT,
    instance_of TEXT,
    object_point TEXT,
    object_coords TEXT
);
\copy mouth_of_watercourse FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/mouth_of_watercourse.csv' DELIMITER ',' CSV HEADER;

-- 10. coordinates.csv
DROP TABLE IF EXISTS coordinates;
CREATE TABLE coordinates (
    subject_q TEXT,
    object_point TEXT,
    object_coords TEXT
);
\copy coordinates FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/coordinates.csv' DELIMITER ',' CSV HEADER;

-- 11. illustrator.csv
DROP TABLE IF EXISTS illustrator;
CREATE TABLE illustrator (
    subject_q TEXT,
    illustrator_q TEXT,
    illustrator_label TEXT,
    illustrator_instance_q TEXT,
    illustrator_instance_label TEXT,
    stated_in_q TEXT,
    stated_in_label TEXT,
    stated_in_instance_q TEXT,
    stated_in_instance_of_label TEXT
);
\copy illustrator FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/illustrator.csv' DELIMITER ',' CSV HEADER;

-- 12. street_addr.csv
DROP TABLE IF EXISTS street_addr;
CREATE TABLE street_addr (
    subject_q TEXT,
    street_address TEXT,
    stated_in_q TEXT,
    stated_in_label TEXT,
    stated_in_instance_q TEXT,
    stated_in_instance_label TEXT
);
\copy street_addr FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/street_addr.csv' DELIMITER ',' CSV HEADER;

-- 13. country.csv
DROP TABLE IF EXISTS country;
CREATE TABLE country (
    subject_q TEXT,
    subject TEXT,
    object_q TEXT,
    object TEXT,
    instance_of_q TEXT,
    instance_of TEXT
);
\copy country FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/country.csv' DELIMITER ',' CSV HEADER;

-- 14. YouTube_Video_ID_Metadata.csv
DROP TABLE IF EXISTS youtube_video_id_metadata;
CREATE TABLE youtube_video_id_metadata (
    subject_q TEXT,
    youtube_id TEXT,
    publication_date TEXT,
    duration TEXT
);
\copy youtube_video_id_metadata FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/YouTube_Video_ID_Metadata.csv' DELIMITER ',' CSV HEADER;

-- 15. image.csv
DROP TABLE IF EXISTS image;
CREATE TABLE image (
    q TEXT,
    image_url TEXT,
    commons_file_url TEXT
);
\copy image FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/image.csv' DELIMITER ',' CSV HEADER;

-- 16. image_metadata.csv
DROP TABLE IF EXISTS image_metadata;
CREATE TABLE image_metadata (
    q TEXT,
    file_url TEXT,
    commons_file_url TEXT,
    wikimedia_url TEXT,
    datetime TEXT,
    objectname TEXT,
    commonsmetadataextension TEXT,
    assessments TEXT,
    gpslatitude TEXT,
    gpslongitude TEXT,
    gpsmapdatum TEXT,
    imagedescription TEXT,
    datetimeoriginal TEXT,
    licenseshortname TEXT,
    usageterms TEXT,
    attributionrequired TEXT,
    licenseurl TEXT,
    copyrighted TEXT,
    restrictions TEXT,
    license TEXT,
    artist_name TEXT,
    artist_link TEXT,
    credit_name TEXT,
    credit_link TEXT
);
\copy image_metadata FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/image_meta.csv' DELIMITER ',' CSV HEADER;

-- 17. video_meta.csv
DROP TABLE IF EXISTS video_meta;
CREATE TABLE video_meta (
    q TEXT,
    file_url TEXT,
    commons_file_url TEXT,
    wikimedia_url TEXT,
    datetime TEXT,
    objectname TEXT,
    commonsmetadataextension TEXT,
    assessments TEXT,
    gpslatitude TEXT,
    gpslongitude TEXT,
    gpsmapdatum TEXT,
    imagedescription TEXT,
    datetimeoriginal TEXT,
    licenseshortname TEXT,
    usageterms TEXT,
    attributionrequired TEXT,
    licenseurl TEXT,
    copyrighted TEXT,
    restrictions TEXT,
    license TEXT,
    artist_name TEXT,
    artist_link TEXT,
    credit_name TEXT,
    credit_link TEXT
);
\copy video_meta FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/video_meta.csv' DELIMITER ',' CSV HEADER;

-- 18. medical_treated.csv
DROP TABLE IF EXISTS medical_treated;
CREATE TABLE medical_treated (
    subject_q TEXT,
    subject TEXT,
    object_q TEXT,
    object TEXT,
    instance_of_q TEXT,
    instance_of TEXT
);
\copy medical_treated FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/medical_treated.csv' DELIMITER ',' CSV HEADER;

-- 19. medical_condition.csv
DROP TABLE IF EXISTS medical_condition;
CREATE TABLE medical_condition (
    subject_q TEXT,
    subject TEXT,
    object_q TEXT,
    object TEXT,
    instance_of_q TEXT,
    instance_of TEXT
);
\copy medical_condition FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/medical_condition.csv' DELIMITER ',' CSV HEADER;

-- 20. historic_county.csv
DROP TABLE IF EXISTS historic_county;
CREATE TABLE historic_county (
    subject_q TEXT,
    subject TEXT,
    object_q TEXT,
    object TEXT,
    instance_of_q TEXT,
    instance_of TEXT
);
\copy historic_county FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/historic_county.csv' DELIMITER ',' CSV HEADER;

-- 21. significant_person.csv
DROP TABLE IF EXISTS significant_person;
CREATE TABLE significant_person (
    subject_q TEXT,
    subject TEXT,
    object_q TEXT,
    object TEXT,
    instance_of_q TEXT,
    instance_of TEXT
);
\copy significant_person FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/significant_person.csv' DELIMITER ',' CSV HEADER;

-- 22. patron_saint.csv
DROP TABLE IF EXISTS patron_saint;
CREATE TABLE patron_saint (
    subject_q TEXT,
    subject TEXT,
    object_q TEXT,
    object TEXT,
    instance_of_q TEXT,
    instance_of TEXT
);
\copy patron_saint FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/patron_saint.csv' DELIMITER ',' CSV HEADER;

-- 23. conservation_state.csv
DROP TABLE IF EXISTS conservation_state;
CREATE TABLE conservation_state (
    subject_q TEXT,
    subject TEXT,
    object_q TEXT,
    object TEXT,
    instance_of_q TEXT,
    instance_of TEXT
);
\copy conservation_state FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/conservation_state.csv' DELIMITER ',' CSV HEADER;

-- 24. ids.csv
DROP TABLE IF EXISTS ids;
CREATE TABLE ids (
    subject_q TEXT,
    p_label TEXT,
    predicate TEXT,
    value TEXT
);
\copy ids FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/ids.csv' DELIMITER ',' CSV HEADER;

-- 25. state.csv
DROP TABLE IF EXISTS state;
CREATE TABLE state (
    subject_q TEXT,
    predicate_p TEXT,
    object_q TEXT,
    object TEXT,
    stated_in_q TEXT,
    stated_in_label TEXT,
    creator TEXT,
    creator_q TEXT,
    depicts TEXT,
    depicts_q TEXT,
    instance_of TEXT,
    instance_of_q TEXT,
    dissolved_date TEXT,
    dissolved_date_q TEXT,
    publication_date TEXT,
    publication_date_q TEXT
);
\copy state FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/state.csv' DELIMITER ',' CSV HEADER;

-- 26. url_neta.csv
DROP TABLE IF EXISTS url_neta;
CREATE TABLE url_neta (
    subject_q TEXT,
    url TEXT,
    url_underscore TEXT,
    qualifier_property TEXT,
    qualifier_value TEXT,
    qualifier_value_p31 TEXT,
    qualifier_value_p31_label TEXT
);
\copy url_neta FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/url_meta.csv' DELIMITER ',' CSV HEADER;

-- 27. url_external.csv
DROP TABLE IF EXISTS url_external;
CREATE TABLE url_external (
    subject_q TEXT,
    url TEXT,
    url_underscore TEXT,
    qualifier_property TEXT,
    qualifier_value TEXT,
    qualifier_value_p31 TEXT,
    qualifier_value_p31_label TEXT
);
\copy url_external FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/url_external.csv' DELIMITER ',' CSV HEADER;

-- 28. url_nonfree.csv
DROP TABLE IF EXISTS url_nonfree;
CREATE TABLE url_nonfree (
    subject_q TEXT,
    url TEXT,
    url_underscore TEXT,
    qualifier_property TEXT,
    qualifier_value TEXT,
    qualifier_value_p31 TEXT,
    qualifier_value_p31_label TEXT
);
\copy url_nonfree FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/url_nonfree.csv' DELIMITER ',' CSV HEADER;

-- 29. use_state.csv
DROP TABLE IF EXISTS use_state;
CREATE TABLE use_state (
    subject_q TEXT,
    subject TEXT,
    object_q TEXT,
    object TEXT,
    instance_of_q TEXT,
    instance_of TEXT
);
\copy use_state FROM '/home/daria/Uni/CAA/nfdi/HolyWells/Wikidata Gathering/csv_data/use_state.csv' DELIMITER ',' CSV HEADER;
