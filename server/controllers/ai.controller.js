export const analyzeResume = async (req, res) => {
    try {
        res.status(200).json({
            message: "AI analysis endpoint working"
        })
    } catch (error) {
        res.status(500).json({
            error: "Server Error"
        })
    }
}