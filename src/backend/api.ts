import axios from "axios"

// export const api_url = `https://api-forrocwb.nandoburgos.dev`
export const api_url = `http://localhost:4545`

export const api = axios.create({ baseURL: api_url })