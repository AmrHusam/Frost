DROP TABLE IF EXISTS calls CASCADE;
DROP TABLE IF EXISTS scripts CASCADE;
DROP TABLE IF EXISTS campaigns CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Schema Definition
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'agent')) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contacts Table
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    company VARCHAR(100),
    status VARCHAR(20) CHECK (status IN ('new', 'contacted', 'qualified', 'customer', 'churned')) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campaigns Table
CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) CHECK (status IN ('draft', 'active', 'completed', 'paused')) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Calls Table
CREATE TABLE calls (
    id SERIAL PRIMARY KEY,
    contact_id INTEGER REFERENCES contacts(id),
    user_id INTEGER REFERENCES users(id),
    campaign_id INTEGER REFERENCES campaigns(id),
    duration_seconds INTEGER,
    outcome VARCHAR(50),
    notes TEXT,
    recording_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scripts Table
CREATE TABLE scripts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    campaign_id INTEGER REFERENCES campaigns(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Seed Data

INSERT INTO users (username, email, password_hash, role, status) VALUES ('Dawson29', 'Dakota.Hirthe@gmail.com', 'HjSJeCKq8qVaJz_', 'admin', 'active');
INSERT INTO users (username, email, password_hash, role, status) VALUES ('Clara28', 'Karolann53@gmail.com', 'uz8ueo1yqot52Kx', 'agent', 'active');
INSERT INTO users (username, email, password_hash, role, status) VALUES ('Crawford.Larkin-Fadel', 'Hildegard.Bahringer67@hotmail.com', 'RiIisl2sdzlEw6K', 'agent', 'active');
INSERT INTO users (username, email, password_hash, role, status) VALUES ('Bennett_Bogan', 'Melany_Keeling@hotmail.com', 'eh9HJmphe9pxHm9', 'agent', 'active');
INSERT INTO users (username, email, password_hash, role, status) VALUES ('Lloyd_Effertz88', 'Emily_Osinski@hotmail.com', 'i2bXUPxW7jxRodu', 'agent', 'active');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Tre', 'Deckow', 'Ciara56@yahoo.com', '937-421-7084 x56356', 'Kozey and Sons', 'customer');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Liana', 'Connelly', 'Garland72@gmail.com', '1-389-917-7469 x2336', 'Sipes, Russel and Barrows', 'new');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Maya', 'Thompson', 'Jany49@yahoo.com', '400-934-4736 x7360', 'Zulauf, Gibson and Konopelski', 'customer');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Mara', 'Fritsch', 'Letitia_Littel@hotmail.com', '991-279-4504 x45526', 'Anderson Group', 'qualified');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Colt', 'Schaefer', 'Bernita.Cummings26@yahoo.com', '1-412-280-5538 x9569', 'Christiansen LLC', 'new');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Kacey', 'Pacocha', 'Christina.Borer@yahoo.com', '855.449.4602 x26610', 'Keebler - Wolf', 'new');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Corene', 'Hand', 'Garland5@gmail.com', '1-430-512-4900', 'Hand, Hettinger and Pacocha', 'qualified');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Noel', 'Lockman', 'Duane.Kozey70@yahoo.com', '(947) 646-4562 x0198', 'Schultz - Lindgren', 'contacted');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Luigi', 'Smith', 'Kiley_Kertzmann@gmail.com', '890.262.4088 x4493', 'Franey, Leffler and Little', 'customer');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Arvel', 'Kling', 'Berry_Wolff75@hotmail.com', '491-924-9070', 'Kutch, Mayert and Stiedemann', 'contacted');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Lilly', 'Keebler', 'Kieran1@hotmail.com', '615-717-1161 x14451', 'Ondricka Inc', 'new');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Rozella', 'Blick', 'Jerald.Swaniawski-Roberts87@hotmail.com', '736.830.5007 x6717', 'Larkin - Kihn', 'churned');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Joan', 'Padberg', 'Weldon.Cummerata35@hotmail.com', '(491) 887-4516 x4484', 'Jacobs - McCullough', 'new');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Trevion', 'Thiel', 'Scot73@hotmail.com', '776-743-7146 x30681', 'Zemlak - Nitzsche', 'churned');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Eloy', 'Parisian', 'Deanna83@yahoo.com', '1-455-771-6149', 'Stamm - Willms', 'qualified');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Jaren', 'Will', 'Verda_Dickinson56@yahoo.com', '1-208-629-3443 x6417', 'Halvorson, Feest and Walsh', 'qualified');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Lavon', 'Gutmann', 'Christa.Ritchie@hotmail.com', '(278) 517-8131 x592', 'Parisian Group', 'qualified');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Adella', 'McDermott', 'Alba_Altenwerth65@gmail.com', '260-709-9139', 'Metz Group', 'churned');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Kyle', 'Olson', 'Carolyn.Lind@yahoo.com', '(930) 904-5911 x376', 'Gislason Group', 'customer');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Lavada', 'Heidenreich', 'Everett.Hand@gmail.com', '(695) 435-4047 x5582', 'Abshire, Braun and DuBuque', 'new');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Beaulah', 'Padberg', 'Conner.Ruecker@hotmail.com', '443.846.5975', 'McCullough, Funk and Mayert', 'contacted');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Arlene', 'Kozey', 'Osbaldo.Kirlin@gmail.com', '1-383-406-9042 x639', 'Langosh - Fadel', 'qualified');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Tristian', 'Hyatt', 'Sadie.Waters@hotmail.com', '1-715-462-8707 x1383', 'Carroll - Lueilwitz', 'new');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Alia', 'Runolfsdottir', 'Lavada.Kling@hotmail.com', '315.210.7169 x7959', 'Hilll, Dietrich and Gislason', 'customer');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Mallory', 'Lebsack', 'Carlie_Reinger3@hotmail.com', '(708) 354-3340 x4852', 'Berge, Renner and Marks', 'qualified');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Salma', 'Gerhold', 'Leslie.Schaefer10@hotmail.com', '242.624.5886 x92477', 'Corkery - Raynor', 'customer');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Moses', 'Buckridge-Sawayn', 'Keira.Watsica-Schneider19@yahoo.com', '(273) 401-0721', 'Nienow - Kihn', 'qualified');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Uriah', 'Keebler', 'Marques_DuBuque91@yahoo.com', '441-519-0804 x161', 'Legros, Gerlach and Langworth', 'contacted');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Morgan', 'Wisozk', 'Darian_Flatley@hotmail.com', '692.963.8331', 'Sawayn Inc', 'contacted');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Eugene', 'Tillman', 'Guadalupe52@yahoo.com', '430.924.6939 x60113', 'Volkman, Senger and Fay', 'new');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('August', 'Robel', 'Merlin.Ritchie@gmail.com', '776.805.3689 x665', 'Boyle LLC', 'churned');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Vallie', 'Cruickshank', 'Bernardo.Prosacco@gmail.com', '423.271.0900 x426', 'Pagac Group', 'new');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Timmy', 'Cormier', 'David.Pfeffer75@gmail.com', '1-759-570-1341', 'Stark - Lehner', 'contacted');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Maurice', 'Hahn-Turcotte', 'Oswald90@yahoo.com', '1-724-524-2093', 'Kreiger Group', 'new');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Merlin', 'Raynor', 'Norbert_Klein@gmail.com', '(945) 919-2259', 'Morissette, Davis and Bernier', 'new');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Matilda', 'Muller', 'Kenneth.Fay40@gmail.com', '471.846.1783 x5414', 'Huels, Bradtke and Hessel', 'new');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Clarabelle', 'Stanton', 'Elijah41@hotmail.com', '756.696.3398 x26064', 'Reinger - Price', 'churned');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Carrie', 'Wintheiser', 'Lauren28@hotmail.com', '(493) 285-3430 x806', 'Lynch, Kling and Steuber', 'churned');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Tad', 'Schulist', 'Wilbert.Thiel@gmail.com', '755.246.2090 x8837', 'Schuppe - Friesen', 'qualified');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Felicia', 'Gleichner', 'Connor_Breitenberg@yahoo.com', '1-389-548-0904 x1255', 'Weimann Inc', 'qualified');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Carolanne', 'Rau', 'Krystal.Carter@hotmail.com', '753-247-4608', 'Breitenberg, Hessel and Kertzmann', 'customer');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Ettie', 'Pagac', 'Lois.Waters86@hotmail.com', '701-994-3090 x7352', 'Lebsack - Ratke', 'qualified');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Kaitlin', 'Cole', 'Reese_Jones36@yahoo.com', '(935) 722-2666 x3024', 'Corwin, Hickle and Klocko', 'new');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Kirk', 'Grimes', 'Jany.Kertzmann20@gmail.com', '463-891-4143', 'Langworth - Gislason', 'qualified');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Izabella', 'Cole-Boyle', 'Clinton34@hotmail.com', '1-267-537-9942 x7272', 'Jacobson - Bruen', 'contacted');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Forest', 'Wehner', 'Murray_Doyle96@hotmail.com', '884.637.0951 x152', 'Heidenreich - Schmitt', 'contacted');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Vicente', 'Bauch', 'Lane.Borer53@gmail.com', '460-894-1520 x43932', 'Torphy Inc', 'new');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Chelsea', 'Moen', 'Quinton.Pfeffer@yahoo.com', '1-686-678-0741 x1625', 'Denesik, Yost and Hilll', 'qualified');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Sadye', 'Boehm', 'Wallace24@gmail.com', '1-483-293-5305', 'Stehr Inc', 'contacted');
INSERT INTO contacts (first_name, last_name, email, phone, company, status) VALUES ('Elyse', 'Lakin', 'Thurman.Abshire91@hotmail.com', '845.520.3179 x221', 'Littel LLC', 'new');
INSERT INTO campaigns (name, description, start_date, status) VALUES ('Fantastic Granite Shoes Launch', 'Similique teres careo calcar depono trado corona asporto voluptatum toties.', '2025-09-13', 'active');
INSERT INTO campaigns (name, description, start_date, status) VALUES ('Electronic Frozen Pizza Launch', 'Subseco sustineo absconditus campana curvo tener considero tabella ut.', '2025-10-19', 'active');
INSERT INTO campaigns (name, description, start_date, status) VALUES ('Electronic Rubber Fish Launch', 'Cattus adfero alius ut tamen virgo utrum casso decumbo calco.', '2025-10-18', 'active');
INSERT INTO scripts (title, content, campaign_id) VALUES ('Cold Call Script V1', 'Tonsor supplanto suspendo cognomen distinctio ciminatio ullam. Creta timidus apparatus caput consectetur deputo. Appello decerno ambulo vulgivagus tardus amaritudo ex coerceo.
Vinco desparatus admoveo validus aptus tamisium paulatim cum considero. Comparo quas subseco supplanto careo defero repellendus arceo spes. Basium denique aqua sto.', 1);
INSERT INTO scripts (title, content, campaign_id) VALUES ('Cold Call Script V1', 'Viduo cervus benevolentia dicta amita suasoria adinventitias. Acerbitas conatus color angelus clibanus correptius votum aqua campana delinquo. Umquam timor arbustum harum thesaurus cum perferendis vociferor creta bos.
Paulatim adicio crebro. Dolorem assumenda impedit crur angustus. Valde cubitum vergo expedita vomica vir dolorem canis paens.', 2);
INSERT INTO scripts (title, content, campaign_id) VALUES ('Cold Call Script V1', 'Abstergo defaeco comburo alius sustineo demitto valens magni. Tondeo summopere vobis terebro crinis facilis. Quaerat succurro a cunctatio aro dolores crudelis.
Necessitatibus decumbo quam decor atque vel sufficio vallum creta. Vestrum voveo assentator cohibeo nobis. Sonitus tametsi victoria agnosco minima quo charisma.', 3);
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (44, 5, 3, 528, 'wrong_number', 'Absorbeo curriculum triduana cribro uberrime vestrum caecus vulnero iste allatus.', 'https://private-clutch.net/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (6, 3, 1, 570, 'wrong_number', 'Saepe suffragium surculus cilicium repellat arma conventus.', 'https://unwilling-market.com');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (1, 4, 3, 65, 'wrong_number', 'Callide vigilo quia decor calculus tantillus nihil.', 'https://harmonious-reactant.biz');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (31, 3, 1, 592, 'connected', 'Patior curriculum denique arceo cedo natus totidem corrumpo.', 'https://thirsty-landmine.com');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (15, 1, 3, 358, 'connected', 'Verecundia altus utrum neque.', 'https://liquid-translation.biz');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (7, 2, 2, 468, 'wrong_number', 'Ustilo totidem confido video.', 'https://odd-furniture.org');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (33, 2, 2, 81, 'connected', 'Commemoro facilis ducimus contra officiis sapiente sodalitas canis soluta.', 'https://genuine-dealing.biz/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (50, 5, 1, 63, 'connected', 'Verecundia demonstro utor admoneo aggero tabgo despecto.', 'https://wasteful-minor.name/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (17, 3, 3, 308, 'busy', 'Vereor tener antea tendo aliqua.', 'https://tough-catalogue.net/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (38, 4, 2, 414, 'wrong_number', 'Vestigium audentia umbra vallum omnis cinis succurro debitis acerbitas.', 'https://rundown-e-reader.info');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (23, 5, 2, 233, 'wrong_number', 'Statua audio terminatio ulciscor error utrimque quia tyrannus.', 'https://thankful-today.biz');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (50, 3, 3, 337, 'wrong_number', 'Sapiente capitulus ambulo desparatus concido tripudio alo decet.', 'https://handsome-default.info/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (29, 2, 3, 337, 'busy', 'Terreo celer aegrus verus cibo amplitudo.', 'https://equal-derby.biz/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (42, 3, 1, 334, 'voicemail', 'Autus tego commodi assumenda depulso currus corrigo abeo ventosus pax.', 'https://moral-sake.net');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (19, 5, 3, 97, 'wrong_number', 'Suspendo stultus canis.', 'https://empty-refectory.com/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (7, 4, 2, 363, 'wrong_number', 'Balbus cur deporto adulatio pel tego viscus.', 'https://soupy-portrait.net');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (32, 4, 1, 299, 'connected', 'Desipio architecto aveho delinquo vado depopulo.', 'https://whimsical-seafood.net');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (29, 3, 1, 271, 'connected', 'Ullus neque voro comedo auditor vorago suggero callide deripio coniuratio.', 'https://quizzical-communist.net');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (11, 2, 2, 511, 'busy', 'Angelus conculco at sumptus suscipio adeo.', 'https://aged-strap.net/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (28, 5, 1, 97, 'busy', 'Apostolus velit succedo vulgaris anser.', 'https://critical-mystery.info');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (40, 4, 1, 291, 'voicemail', 'Pel vespillo conduco compono sustineo amicitia cedo arguo solum absconditus.', 'https://tricky-garter.name');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (19, 3, 3, 119, 'voicemail', 'Aveho ullam sequi.', 'https://hearty-seep.info');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (50, 5, 2, 202, 'busy', 'Colligo auditor vinculum.', 'https://past-corduroy.com');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (50, 2, 3, 388, 'connected', 'Audio animus ventosus decens corpus conicio.', 'https://pointless-responsibility.net/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (33, 2, 2, 475, 'connected', 'Alius succedo angelus.', 'https://magnificent-availability.org/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (5, 1, 1, 164, 'connected', 'Astrum deserunt solutio sperno cupressus ceno urbanus.', 'https://imaginative-crumb.biz/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (22, 4, 3, 364, 'busy', 'Desolo subito demonstro censura.', 'https://basic-electrocardiogram.biz/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (13, 1, 3, 75, 'connected', 'Anser socius voluptates alioqui vel admoveo eius.', 'https://virtual-clan.name');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (19, 1, 2, 191, 'busy', 'Torrens sto ultra occaecati canis celo pecus vociferor.', 'https://honest-crunch.biz/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (19, 2, 3, 554, 'voicemail', 'Advenio desino deprimo volutabrum deludo.', 'https://happy-sculpting.org');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (23, 5, 2, 300, 'voicemail', 'Arma patior perferendis terebro sperno.', 'https://purple-jam.biz/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (7, 2, 3, 492, 'wrong_number', 'Sum coma victoria vindico curatio demoror capto caritas decretum.', 'https://brilliant-railing.net/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (14, 3, 2, 364, 'connected', 'Adaugeo defetiscor commodi demens quasi aliqua victus abbas.', 'https://outlying-optimization.name/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (37, 5, 3, 251, 'busy', 'Termes suggero articulus maiores undique cuius super deludo somniculosus textilis.', 'https://wide-eyed-grasshopper.com/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (26, 1, 1, 584, 'connected', 'Ante ter acceptus deripio thesis sit careo excepturi.', 'https://formal-wafer.info');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (48, 1, 2, 486, 'voicemail', 'Aggero veniam tot texo utrimque carpo canis bestia officia victoria.', 'https://hopeful-petitioner.com/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (20, 4, 3, 33, 'wrong_number', 'Nostrum adhuc suffragium stabilis censura trans.', 'https://idle-quarter.net');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (45, 1, 3, 157, 'voicemail', 'Aut arbor casus solutio campana tabgo sequi bonus vulticulus.', 'https://steep-pajamas.org');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (10, 1, 1, 134, 'wrong_number', 'Arbustum aequus beneficium.', 'https://responsible-desert.biz/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (8, 1, 2, 75, 'voicemail', 'Antea aestas adicio desolo vergo degusto.', 'https://spotless-building.name');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (24, 1, 1, 546, 'connected', 'Sperno bestia ventito porro uredo cognatus cenaculum omnis decor.', 'https://bogus-acid.name/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (39, 1, 2, 135, 'voicemail', 'Talio viscus tener.', 'https://bowed-provider.org/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (38, 2, 2, 286, 'busy', 'Celebrer accusantium clarus audentia vulnus.', 'https://hidden-file.biz/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (26, 1, 2, 203, 'busy', 'Molestiae recusandae super adhuc aufero bellicus acerbitas cometes cunctatio.', 'https://long-term-glockenspiel.org/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (19, 3, 1, 126, 'wrong_number', 'Sit adipiscor subiungo synagoga crastinus corona caveo temporibus.', 'https://guilty-insect.org');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (50, 1, 3, 504, 'wrong_number', 'Alioqui varius dolorum demens conventus sulum aperte.', 'https://misty-bean.info/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (10, 5, 1, 596, 'voicemail', 'Solutio ante conitor.', 'https://grave-contagion.info/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (26, 2, 3, 27, 'connected', 'Velut cotidie vos arcus animus damnatio debilito facere.', 'https://overdue-merchant.org');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (31, 3, 3, 490, 'connected', 'Depraedor ulterius vorago accedo reiciendis carbo.', 'https://caring-spirituality.org');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (16, 4, 2, 214, 'connected', 'Tunc voluptas eligendi sublime tutamen incidunt.', 'https://compassionate-archeology.biz');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (32, 1, 1, 571, 'wrong_number', 'Porro audeo cognomen decerno cuppedia patria.', 'https://humongous-tin.name');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (41, 2, 3, 325, 'busy', 'Agnosco ago annus commodi statim pectus tametsi.', 'https://lovable-armadillo.info/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (1, 1, 1, 115, 'wrong_number', 'Vado creo impedit amplitudo auxilium bardus capio.', 'https://worried-peek.biz');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (18, 3, 2, 292, 'voicemail', 'Deporto velit venustas.', 'https://easy-spring.biz/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (28, 4, 2, 219, 'connected', 'Caput beneficium ascit eaque.', 'https://experienced-east.name');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (28, 5, 1, 414, 'busy', 'Cruentus coniuratio caterva solum facilis textor cervus.', 'https://runny-assignment.net');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (33, 2, 3, 186, 'wrong_number', 'Peccatus delectus cunabula ut comprehendo soleo confido triduana.', 'https://golden-lunge.biz');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (9, 1, 2, 117, 'busy', 'Summopere ea quaerat canonicus aspicio cultellus cervus vos sunt verus.', 'https://creepy-dump.info/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (17, 5, 2, 172, 'connected', 'Adhuc optio tam peior vix.', 'https://glittering-boatyard.net/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (4, 1, 1, 158, 'busy', 'Carus caries cena est volo alo casus esse astrum.', 'https://defensive-angstrom.name');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (46, 5, 3, 342, 'busy', 'Dolorum adsidue censura vestrum vis tonsor victus alias spargo annus.', 'https://double-suitcase.name');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (25, 3, 2, 334, 'wrong_number', 'Abduco vulnus cursim cumque.', 'https://relieved-pollutant.info');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (44, 3, 2, 92, 'wrong_number', 'Cruciamentum aiunt quod videlicet damno quas approbo catena.', 'https://mad-physiology.biz/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (20, 1, 2, 97, 'connected', 'Quod amplitudo audax tergo deficio confero tam voro hic.', 'https://idolized-profit.biz/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (26, 5, 2, 439, 'wrong_number', 'Adimpleo teres tertius sumptus bis pecto amita sophismata consectetur alias.', 'https://frightening-skate.net');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (29, 1, 2, 36, 'busy', 'Vir paens labore vero arca deputo strenuus sint vereor adulatio.', 'https://somber-isolation.com');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (49, 4, 2, 170, 'voicemail', 'Abscido vester beneficium quasi.', 'https://anguished-repair.info');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (30, 3, 1, 491, 'connected', 'Coniuratio vado pauper caries cras.', 'https://exemplary-landmine.com');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (35, 3, 3, 544, 'wrong_number', 'Repudiandae colo adiuvo terebro conventus aestas corona sufficio alii.', 'https://phony-dickey.net');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (28, 1, 1, 519, 'wrong_number', 'Defluo apostolus sit deputo sum veritatis infit natus desolo.', 'https://enchanted-trustee.biz');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (35, 4, 3, 146, 'wrong_number', 'Peccatus desparatus degusto id pauci cum.', 'https://blind-gravity.com');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (29, 1, 2, 287, 'connected', 'Claustrum astrum demum sopor pecco auxilium suffragium curis doloribus cognomen.', 'https://total-politics.net/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (29, 2, 2, 239, 'connected', 'Deserunt capitulus stabilis tener.', 'https://heartfelt-slip.com');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (32, 2, 3, 371, 'connected', 'Via conqueror commodi attonbitus vobis atrox tero velit.', 'https://flat-hydrolyse.info/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (47, 2, 2, 549, 'voicemail', 'Inventore audentia cruciamentum appello adaugeo defetiscor admoveo magni benigne.', 'https://another-opportunity.org');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (19, 1, 3, 38, 'connected', 'Quam autem tenetur ab summopere sustineo recusandae cado amplitudo.', 'https://spectacular-smith.name/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (26, 5, 1, 337, 'voicemail', 'Voluptatibus venustas decor accusamus corpus comminor.', 'https://wooden-webinar.org');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (35, 3, 2, 476, 'busy', 'Uredo cupiditate capto carmen distinctio repellat supellex.', 'https://scared-probe.biz');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (5, 2, 1, 512, 'connected', 'Cohors deduco urbanus varietas.', 'https://young-reprocessing.com/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (26, 2, 2, 395, 'busy', 'Vel abstergo cotidie caveo ter.', 'https://lucky-bat.info');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (21, 4, 1, 25, 'busy', 'Derelinquo fugiat delibero ab approbo.', 'https://inborn-jalapeno.biz');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (5, 3, 3, 380, 'busy', 'Artificiose ascisco totus tabgo.', 'https://neglected-enigma.net/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (45, 4, 2, 538, 'wrong_number', 'Tredecim solitudo blanditiis officiis stillicidium vesper.', 'https://unwieldy-pupa.info');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (23, 4, 3, 393, 'wrong_number', 'Bene dolorem comis.', 'https://oily-serum.name/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (15, 3, 3, 261, 'wrong_number', 'Dedico capto vomica aureus illum cervus celebrer universe cubitum arma.', 'https://digital-combination.name');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (44, 3, 2, 54, 'busy', 'Viscus cariosus turba angustus infit tabgo thalassinus apud tutis derideo.', 'https://rubbery-wet-bar.com');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (20, 5, 3, 376, 'wrong_number', 'Utilis desipio decerno caterva aegrus.', 'https://gracious-grease.com/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (3, 3, 3, 41, 'busy', 'Taedium atavus alius advoco tamquam.', 'https://rigid-stupidity.name');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (36, 5, 3, 337, 'connected', 'Sol demitto solus.', 'https://dual-answer.com');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (48, 5, 2, 482, 'connected', 'Valeo arto adulescens sublime amiculum occaecati confido.', 'https://decisive-affair.biz');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (26, 3, 3, 135, 'voicemail', 'Voluptatem una absque solium.', 'https://experienced-opera.biz');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (23, 2, 2, 140, 'connected', 'Alioqui culpo aranea cena reprehenderit.', 'https://submissive-heritage.com/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (18, 4, 3, 340, 'voicemail', 'Abeo benevolentia curriculum sublime vulpes sonitus virtus.', 'https://plush-temporary.org/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (45, 4, 1, 115, 'connected', 'Apparatus commodi artificiose calamitas ipsa voluptate civitas.', 'https://exalted-mining.biz/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (43, 1, 2, 404, 'wrong_number', 'Theca absque animi pecco aegrotatio sono.', 'https://honest-competence.net/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (42, 2, 2, 115, 'busy', 'Tondeo tristis curis deficio curia animi curso vulgivagus spiculum.', 'https://welcome-loss.info/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (7, 4, 2, 394, 'connected', 'Cibus colo accusator.', 'https://original-filter.name/');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (13, 4, 3, 510, 'busy', 'Tero attero dolorum bis vitae vesper cursim vel.', 'https://svelte-reserve.com');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (28, 2, 1, 147, 'voicemail', 'Speculum communis usus arbor adduco casso solus.', 'https://colorful-head.biz');
INSERT INTO calls (contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url) VALUES (30, 4, 2, 294, 'voicemail', 'Vergo capillus voco audentia.', 'https://gigantic-sister-in-law.com/');
