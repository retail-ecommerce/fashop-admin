import fa from "@/fa";

export default {
    async edit(data = {}) {
        return await fa.request({
            url: `payment/edit`,
            method: "POST",
            data
        });
    },
    async info(data = {}) {
        return await fa.request({
            url: `payment/info`,
            method: "GET",
            data
        });
    }
};