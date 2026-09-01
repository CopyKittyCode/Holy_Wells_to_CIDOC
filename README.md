# Holy_Wells_to_CIDOC
Fetching data from wikidata and organizing it in a CIDOC compliant ontology

project_root/
│
├── requirements.txt        # Python dependencies required for running the query scripts
│
├── HolyWells_Wikidata_gathering.ipynb         # Main script for querying Wikidata and generating CSV files
│
├── csv_data/               # Folder for the CSV files generated from Wikidata queries
│   ├── load_csvs.sql       # Script for uploading all resulting CSV tables to PostgreSQL
│
└── ontology/               # Custom ontologies and OBDA mappings for Protégé
    ├── HolyWells_Ontology.obda           # OBDA mappings sample. 
    ├── cataog-v001.xml     		  # catalog for ontology import from the ontologies folder
    └── HolyWells_Ontology.rdf            # The ontology integrating holy wells with CIDOC


To run the querying script: 
pip install -r requirements.txt

