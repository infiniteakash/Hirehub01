const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8002";

export const USER_API_END_POINT=`${API_BASE_URL}/api/v1/user`;
export const JOB_API_END_POINT=`${API_BASE_URL}/api/v1/job`;
export const APPLICATION_API_END_POINT=`${API_BASE_URL}/api/v1/application`;
export const COMPANY_API_END_POINT=`${API_BASE_URL}/api/v1/company`;
export const MATCH_API_END_POINT=`${API_BASE_URL}/api/match-jobs`;
export const RESUME_PARSE_END_POINT=`${API_BASE_URL}/api/v1/user/resume/parse`;
export const RESUME_SAVE_END_POINT=`${API_BASE_URL}/api/v1/user/resume/save`;
export const RESUME_LIST_END_POINT=`${API_BASE_URL}/api/v1/user/resume/list`;
export const RESUME_DOWNLOAD_END_POINT=`${API_BASE_URL}/api/v1/user/resume/download`;