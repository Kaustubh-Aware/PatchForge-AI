const validateGitHubRepository = (url) => {
    const regex = /^https:\/\/github\.com\/[^/]+\/[^/]+\/?$/;

    return regex.test(url);
};

module.exports = validateGitHubRepository;