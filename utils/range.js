module.exports = {
    range: function(start, end) {
        return Array.from({ length: end - start + 1 }, (_, i) => i);
    },
};