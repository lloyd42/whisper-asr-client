import type { AxiosError, AxiosResponse } from "axios";
import axios from "axios";

// 定义错误详情接口
interface ErrorDetail {
	msg: string;
	// 根据实际API响应，可以添加更多字段，例如 loc, type
}

// 定义错误响应数据接口
interface ErrorResponseData {
	detail?: string | ErrorDetail[];
	message?: string;
	// 根据实际API响应，可以添加更多字段
}

// 创建 Axios 实例
const apiClient = axios.create({
	baseURL: "/api", // 使用代理前缀
	timeout: 60000, // 60秒超时
	headers: {
		"Content-Type": "application/json",
	},
});

// 请求拦截器
apiClient.interceptors.request.use(
	(config) => {
		// 可以在这里添加认证token等
		return config;
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	},
);

// 响应拦截器
apiClient.interceptors.response.use(
	(response: AxiosResponse) => {
		// 对响应数据做处理
		return response;
	},
	(error: AxiosError) => {
		// 统一错误处理
		let errorMessage = "请求失败";
		let statusCode = 500;

		if (error.response) {
			statusCode = error.response.status;
			// 尝试提取错误详情
			const data = error.response.data as ErrorResponseData; // 使用定义的接口
			if (data?.detail) {
				if (Array.isArray(data.detail)) {
					errorMessage = data.detail.map((d: ErrorDetail) => d.msg).join("; "); // 明确 d 的类型
				} else if (typeof data.detail === "string") {
					errorMessage = data.detail;
				}
			} else {
				errorMessage = data?.message || error.response.statusText;
			}
		} else if (error.request) {
			// 请求已发出但没有响应
			errorMessage = "服务器未响应，请检查网络连接";
		} else {
			// 其他错误
			errorMessage = error.message;
		}

		// 创建自定义错误对象
		const customError = {
			status: statusCode,
			message: errorMessage,
			details: error.response?.data,
			original: error,
		};

		return Promise.reject(customError);
	},
);

export default apiClient;
