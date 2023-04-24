import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as jsYaml from 'js-yaml';

export const useObjectStateStore = defineStore('objectstate', {
    state: () => {
        const schemaText = ref(_schemaText)
        const currentObject = {
            wrangling: [{ name: 'nop' }],
            analysis: [{ name: 'nop' }],
            visualization: [{ name: 'nop' }]
        }

        return {
            schemaText,
            currentObject
        }
    },
    getters: () => {
        objectMarkdown: (state) => '\`\`\`yaml\n${jsYaml.dump(state.templateConfig)}\n\`\`\`'
    }
});

let _schemaText = `# Kwalify Schema
map:
 wrangling:
  desc: "Data Wrangling"
  required: True
  seq:
  - map:
     name:
      type: str
      pattern: filter-data
      required: True
      desc: "Function for filterings data, e.g., pollutant = 'PM2.5' and months-back = 12 to filter the dataset to only include PM2.5 data from the last year."
     pollutant:
      type: str
      required: True
      desc: "The air pollutant, e.g., fine particulate matter concentration"
      example: "PM2.5"
     months-back:
      type: int
      required: False
      desc: "Number of month back to include"
      example: "12"
  - map:
     name:
      type: str
      pattern: aggregate-data
      required: True
     aggregation-level:
      type: str
      required: True
      example: "city"
     aggregation-function:
      type: str
      required: False
      example: "mean"
  - map:
     name:
      type: str
      pattern: nop
      required: True
      desc: "Empty placeholder function not doing anything"
 analysis:
  desc: "Data Analysis"
  required: True
  seq:
  - map:
     name:
      type: str
      pattern: trend-analysis
      required: True
     time-unit:
      type: str
      required: True
      example: "month"
     smoothing:
      type: str
      required: False
      example: "moving-average"
  - map:
     name:
      type: str
      pattern: seasonal-decomposition
      required: True
     frequency:
      type: int
      required: True
      desc: "e.g., 12 for monthly seasonality"
      example: "12"
     decomposition-method:
      type: str
      required: False
      example: "additive"
  - map:
     name:
      type: str
      pattern: nop
      required: True
      desc: "Empty placeholder function not doing anything"
 visualization:
  desc: "Data Visualization"
  required: True
  seq:
   - map:
      name:
       type: str
       pattern: line-chart
       required: True
      x-axis:
       type: str
       required: True
       example: "time"
      y-axis-label:
       type: str
       required: False
       example: "PM2.5 Concentration"
   - map:
      name:
       type: str
       pattern: heatmap
       required: True
      color-scale:
       type: str
       required: True
       example: "Reds"
      annotation:
       type: bool
       required: False
       desc: "A boolean value, e.g., True for displaying values"
       example: "True"
   - map:
      name:
       type: str
       pattern: nop
       required: True
       desc: "Empty placeholder function not doing anything"
required: True`