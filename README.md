# Project-3
This project is an analysis of several decades of climate and natural disaster data showing the relationship between frequency and severity of natural disasters, temperature anomalies, and the positive correlation between the two. It also analyzes global death tolls from natural disasters. Sources include FEMA’s natural disaster declarations in the United States, National Centers for Environmental Information's global land and ocean surface temperature analysis, and a Kaggle database of over 14,000 natural disasters across the world.

This project demonstrates an in-depth understanding of Python, Pandas, Flask-APIs, SQL and SQLite, Javascript, JQuery, HTML, CSS, Plotly, and Leaflet to turn raw data into visualizations, which can then be used to create conclusions of data in an understandable and appealing way.

To access the database, the app.py folder must be opened, ran, and debugged in order to run the session from which the website can pull the information. The index folder can then be opened which will open the website. The website contains three interactive graphs. One graph displays the FEMA data gathered of United States Disasters from 1953 to 2023. The data shows a clear trend that as time goes on, more natural disasters have occurred. This graph can also be toggled to return results from a specific set of years and return results of a specific disaster type. The second graph on this website shows NASA’s data on recorded temperature anomalies. Again, there is a positive correlation between the passage of time and increasing anomalies. This graph can be toggled to show data from specific years as well. The third graph displays global death tolls of natural disasters. Surprisingly, this data does not correlate with the other two graphs. Global death rates from natural disasters have not increased with the frequency of disasters and the increase of temperature anomalies. This is likely due to advancements in technology and living standards. This graph shows that singular, devastating natural disasters are responsible for the majority of deaths, such as the 2004 Indian Ocean Tsunami, 2008 Sichuan Earthquake, and 2010 Haiti Earthquake. 

The project also includes an interactive map of the United States and the number of disasters that have occurred in each county since 1953. This map was created from the FEMA dataset and utilizes Leaflet and Plotly to create a choropleth map of the United States. One can click on the county of interest and see how many disasters have struck the selected area.

This project showcases a strong knowledge of various data analysis tools and how using these tools together creates a more thorough and detailed analysis than  relying on a singular programming language or database.

![image](https://github.com/marlablanco/Project-3/assets/132520770/9747cae5-520f-42c8-95b9-3b0dbb74fbcc)\
![image](https://github.com/marlablanco/Project-3/assets/132520770/428acdc5-d9cb-4097-887d-f2ea97f120a6)\
![image](https://github.com/marlablanco/Project-3/assets/132520770/9680e645-8580-4729-bc7b-be92c8dc727c)\
![image](https://github.com/marlablanco/Project-3/assets/132520770/4e21e5bd-61c1-4207-bf34-d0fbf56bd08f)

### Sources
Database datasets:\
https://www.fema.gov/openfema-data-page/disaster-declarations-summaries-v2  
https://data.giss.nasa.gov/gistemp/sources_v4/  
https://www.kaggle.com/datasets/brsdincer/all-natural-disasters-19002021-eosdis

`geojson-counties-fips.json` was sourced from https://github.com/plotly/datasets  
`counties.geojson` was sourced from https://gist.github.com/sdwfrost/d1c73f91dd9d175998ed166eb216994a#file-counties-geojson  
`fipsToState.json` was sourced from https://gist.github.com/wavded/1250983/bf7c1c08f7b1596ca10822baeb8049d7350b0a4b
