exports.get404 = (req, res, next) => {
    res.status(404).render("404.ejs", {
        description: "Page introuvable!!",
        url: "/acceuil",
        title: "404",
        label: "Acceuil"
    });
};