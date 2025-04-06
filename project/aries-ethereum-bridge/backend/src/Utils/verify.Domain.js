// import dns from "dns/promises";

// const verifyDomain = async (email, res) => {
//     if (!email || !email.includes("@")) {
//         console.log("Invalid email format: missing domain.");
//         res.status(400).send("Invalid email format: missing domain.");
//         return false; // Stop further execution
//     }

//     const domain = email.split("@")[1]; // Extract the domain

//     try {
//         const records = await dns.resolveMx(domain); // Use DNS MX lookup
//         if (records && records.length > 0) {
//             console.log(`Domain verified: ${domain}`);
//             return true; // Domain is valid
//         } else {
//             console.log(`Domain verification failed for: ${domain}`);
//             res.status(400).send("Invalid domain: please enter a proper domain.");
//             return false; // Stop further execution
//         }
//     } catch (error) {
//         if (error.code === "ENOTFOUND") {
//             console.log(`Domain not found: ${domain}`);
//             res.status(400).send("Invalid domain: please enter a proper domain.");
//         } else {
//             console.error(`Error verifying domain: ${error.message}`);
//             res.status(500).send("Server error while verifying domain.");
//         }
//         return false; // Stop further execution
//     }
// };
// export default verifyDomain;



import dns from "dns/promises";

const verifyDomain = async (email) => {
    if (!email || !email.includes("@")) {
        throw new Error("Invalid email format: missing domain.");
    }

    const domain = email.split("@")[1];

    try {
        const dnsPromise = dns.resolveMx(domain);
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('DNS lookup timeout')), 5000)
        );
        
        const records = await Promise.race([dnsPromise, timeoutPromise]);
        return records && records.length > 0;
    } catch (error) {
        if (error.code === "ENOTFOUND") {
            throw new Error("Invalid domain: please enter a proper domain.");
        }
        throw new Error(`Error verifying domain: ${error.message}`);
    }
};

export default verifyDomain;