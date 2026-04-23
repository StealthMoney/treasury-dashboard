import { toast, ToastOptions, Id } from "react-toastify"

type ToastType = "default" | "success" | "error" | "info" | "warning"

export const showToast = (
	message: string,
	type: ToastType = "default",
	id?: Id,
	options?: ToastOptions
) => {
	if (id && toast.isActive(id)) return

	const config: ToastOptions = {
		toastId: id,
		...options,
	}

	switch (type) {
		case "success":
			return toast.success(message, config)
		case "error":
			return toast.error(message, config)
		case "info":
			return toast.info(message, config)
		case "warning":
			return toast.warning(message, config)
		default:
			return toast(message, config)
	}
}
