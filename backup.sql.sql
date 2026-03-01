--
-- PostgreSQL database dump
--

\restrict bIhg2psGlCh4PmlsVOowj3I8Z20IJ62QP53Y5mdaCk8NE1RkXKCdh51BKsSe89c

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: calls; Type: TABLE; Schema: public; Owner: frost_admin
--

CREATE TABLE public.calls (
    id integer NOT NULL,
    contact_id integer,
    user_id integer,
    campaign_id integer,
    duration_seconds integer,
    outcome character varying(50),
    notes text,
    recording_url character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.calls OWNER TO frost_admin;

--
-- Name: calls_id_seq; Type: SEQUENCE; Schema: public; Owner: frost_admin
--

CREATE SEQUENCE public.calls_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.calls_id_seq OWNER TO frost_admin;

--
-- Name: calls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: frost_admin
--

ALTER SEQUENCE public.calls_id_seq OWNED BY public.calls.id;


--
-- Name: campaigns; Type: TABLE; Schema: public; Owner: frost_admin
--

CREATE TABLE public.campaigns (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    start_date date,
    end_date date,
    status character varying(20) DEFAULT 'draft'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT campaigns_status_check CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'active'::character varying, 'completed'::character varying, 'paused'::character varying])::text[])))
);


ALTER TABLE public.campaigns OWNER TO frost_admin;

--
-- Name: campaigns_id_seq; Type: SEQUENCE; Schema: public; Owner: frost_admin
--

CREATE SEQUENCE public.campaigns_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.campaigns_id_seq OWNER TO frost_admin;

--
-- Name: campaigns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: frost_admin
--

ALTER SEQUENCE public.campaigns_id_seq OWNED BY public.campaigns.id;


--
-- Name: contacts; Type: TABLE; Schema: public; Owner: frost_admin
--

CREATE TABLE public.contacts (
    id integer NOT NULL,
    first_name character varying(50),
    last_name character varying(50),
    email character varying(100),
    phone character varying(20),
    company character varying(100),
    status character varying(20) DEFAULT 'new'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT contacts_status_check CHECK (((status)::text = ANY ((ARRAY['new'::character varying, 'contacted'::character varying, 'qualified'::character varying, 'customer'::character varying, 'churned'::character varying])::text[])))
);


ALTER TABLE public.contacts OWNER TO frost_admin;

--
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: frost_admin
--

CREATE SEQUENCE public.contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contacts_id_seq OWNER TO frost_admin;

--
-- Name: contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: frost_admin
--

ALTER SEQUENCE public.contacts_id_seq OWNED BY public.contacts.id;


--
-- Name: scripts; Type: TABLE; Schema: public; Owner: frost_admin
--

CREATE TABLE public.scripts (
    id integer NOT NULL,
    title character varying(100) NOT NULL,
    content text NOT NULL,
    campaign_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.scripts OWNER TO frost_admin;

--
-- Name: scripts_id_seq; Type: SEQUENCE; Schema: public; Owner: frost_admin
--

CREATE SEQUENCE public.scripts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.scripts_id_seq OWNER TO frost_admin;

--
-- Name: scripts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: frost_admin
--

ALTER SEQUENCE public.scripts_id_seq OWNED BY public.scripts.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: frost_admin
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'agent'::character varying])::text[]))),
    CONSTRAINT users_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO frost_admin;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: frost_admin
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO frost_admin;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: frost_admin
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: calls id; Type: DEFAULT; Schema: public; Owner: frost_admin
--

ALTER TABLE ONLY public.calls ALTER COLUMN id SET DEFAULT nextval('public.calls_id_seq'::regclass);


--
-- Name: campaigns id; Type: DEFAULT; Schema: public; Owner: frost_admin
--

ALTER TABLE ONLY public.campaigns ALTER COLUMN id SET DEFAULT nextval('public.campaigns_id_seq'::regclass);


--
-- Name: contacts id; Type: DEFAULT; Schema: public; Owner: frost_admin
--

ALTER TABLE ONLY public.contacts ALTER COLUMN id SET DEFAULT nextval('public.contacts_id_seq'::regclass);


--
-- Name: scripts id; Type: DEFAULT; Schema: public; Owner: frost_admin
--

ALTER TABLE ONLY public.scripts ALTER COLUMN id SET DEFAULT nextval('public.scripts_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: frost_admin
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: calls; Type: TABLE DATA; Schema: public; Owner: frost_admin
--

COPY public.calls (id, contact_id, user_id, campaign_id, duration_seconds, outcome, notes, recording_url, created_at) FROM stdin;
1	44	5	3	528	wrong_number	Absorbeo curriculum triduana cribro uberrime vestrum caecus vulnero iste allatus.	https://private-clutch.net/	2026-02-07 04:18:02.752978
2	6	3	1	570	wrong_number	Saepe suffragium surculus cilicium repellat arma conventus.	https://unwilling-market.com	2026-02-07 04:18:02.760032
3	1	4	3	65	wrong_number	Callide vigilo quia decor calculus tantillus nihil.	https://harmonious-reactant.biz	2026-02-07 04:18:02.764047
4	31	3	1	592	connected	Patior curriculum denique arceo cedo natus totidem corrumpo.	https://thirsty-landmine.com	2026-02-07 04:18:02.768662
5	15	1	3	358	connected	Verecundia altus utrum neque.	https://liquid-translation.biz	2026-02-07 04:18:02.778768
6	7	2	2	468	wrong_number	Ustilo totidem confido video.	https://odd-furniture.org	2026-02-07 04:18:02.782387
7	33	2	2	81	connected	Commemoro facilis ducimus contra officiis sapiente sodalitas canis soluta.	https://genuine-dealing.biz/	2026-02-07 04:18:02.786059
8	50	5	1	63	connected	Verecundia demonstro utor admoneo aggero tabgo despecto.	https://wasteful-minor.name/	2026-02-07 04:18:02.789335
9	17	3	3	308	busy	Vereor tener antea tendo aliqua.	https://tough-catalogue.net/	2026-02-07 04:18:02.792563
10	38	4	2	414	wrong_number	Vestigium audentia umbra vallum omnis cinis succurro debitis acerbitas.	https://rundown-e-reader.info	2026-02-07 04:18:02.795557
11	23	5	2	233	wrong_number	Statua audio terminatio ulciscor error utrimque quia tyrannus.	https://thankful-today.biz	2026-02-07 04:18:02.798609
12	50	3	3	337	wrong_number	Sapiente capitulus ambulo desparatus concido tripudio alo decet.	https://handsome-default.info/	2026-02-07 04:18:02.802055
13	29	2	3	337	busy	Terreo celer aegrus verus cibo amplitudo.	https://equal-derby.biz/	2026-02-07 04:18:02.829588
14	42	3	1	334	voicemail	Autus tego commodi assumenda depulso currus corrigo abeo ventosus pax.	https://moral-sake.net	2026-02-07 04:18:02.8329
15	19	5	3	97	wrong_number	Suspendo stultus canis.	https://empty-refectory.com/	2026-02-07 04:18:02.836138
16	7	4	2	363	wrong_number	Balbus cur deporto adulatio pel tego viscus.	https://soupy-portrait.net	2026-02-07 04:18:02.838983
17	32	4	1	299	connected	Desipio architecto aveho delinquo vado depopulo.	https://whimsical-seafood.net	2026-02-07 04:18:02.842548
18	29	3	1	271	connected	Ullus neque voro comedo auditor vorago suggero callide deripio coniuratio.	https://quizzical-communist.net	2026-02-07 04:18:02.846711
19	11	2	2	511	busy	Angelus conculco at sumptus suscipio adeo.	https://aged-strap.net/	2026-02-07 04:18:02.849896
20	28	5	1	97	busy	Apostolus velit succedo vulgaris anser.	https://critical-mystery.info	2026-02-07 04:18:02.853313
21	40	4	1	291	voicemail	Pel vespillo conduco compono sustineo amicitia cedo arguo solum absconditus.	https://tricky-garter.name	2026-02-07 04:18:02.85629
22	19	3	3	119	voicemail	Aveho ullam sequi.	https://hearty-seep.info	2026-02-07 04:18:02.859624
23	50	5	2	202	busy	Colligo auditor vinculum.	https://past-corduroy.com	2026-02-07 04:18:02.862634
24	50	2	3	388	connected	Audio animus ventosus decens corpus conicio.	https://pointless-responsibility.net/	2026-02-07 04:18:02.865427
25	33	2	2	475	connected	Alius succedo angelus.	https://magnificent-availability.org/	2026-02-07 04:18:02.868313
26	5	1	1	164	connected	Astrum deserunt solutio sperno cupressus ceno urbanus.	https://imaginative-crumb.biz/	2026-02-07 04:18:02.870814
27	22	4	3	364	busy	Desolo subito demonstro censura.	https://basic-electrocardiogram.biz/	2026-02-07 04:18:02.874903
28	13	1	3	75	connected	Anser socius voluptates alioqui vel admoveo eius.	https://virtual-clan.name	2026-02-07 04:18:02.894723
29	19	1	2	191	busy	Torrens sto ultra occaecati canis celo pecus vociferor.	https://honest-crunch.biz/	2026-02-07 04:18:02.897339
30	19	2	3	554	voicemail	Advenio desino deprimo volutabrum deludo.	https://happy-sculpting.org	2026-02-07 04:18:02.900074
31	23	5	2	300	voicemail	Arma patior perferendis terebro sperno.	https://purple-jam.biz/	2026-02-07 04:18:02.903042
32	7	2	3	492	wrong_number	Sum coma victoria vindico curatio demoror capto caritas decretum.	https://brilliant-railing.net/	2026-02-07 04:18:02.906185
33	14	3	2	364	connected	Adaugeo defetiscor commodi demens quasi aliqua victus abbas.	https://outlying-optimization.name/	2026-02-07 04:18:02.908956
34	37	5	3	251	busy	Termes suggero articulus maiores undique cuius super deludo somniculosus textilis.	https://wide-eyed-grasshopper.com/	2026-02-07 04:18:02.911783
35	26	1	1	584	connected	Ante ter acceptus deripio thesis sit careo excepturi.	https://formal-wafer.info	2026-02-07 04:18:02.914713
36	48	1	2	486	voicemail	Aggero veniam tot texo utrimque carpo canis bestia officia victoria.	https://hopeful-petitioner.com/	2026-02-07 04:18:02.917499
37	20	4	3	33	wrong_number	Nostrum adhuc suffragium stabilis censura trans.	https://idle-quarter.net	2026-02-07 04:18:02.920322
38	45	1	3	157	voicemail	Aut arbor casus solutio campana tabgo sequi bonus vulticulus.	https://steep-pajamas.org	2026-02-07 04:18:02.922819
39	10	1	1	134	wrong_number	Arbustum aequus beneficium.	https://responsible-desert.biz/	2026-02-07 04:18:02.926639
40	8	1	2	75	voicemail	Antea aestas adicio desolo vergo degusto.	https://spotless-building.name	2026-02-07 04:18:02.929801
41	24	1	1	546	connected	Sperno bestia ventito porro uredo cognatus cenaculum omnis decor.	https://bogus-acid.name/	2026-02-07 04:18:02.933005
42	39	1	2	135	voicemail	Talio viscus tener.	https://bowed-provider.org/	2026-02-07 04:18:02.936651
43	38	2	2	286	busy	Celebrer accusantium clarus audentia vulnus.	https://hidden-file.biz/	2026-02-07 04:18:02.940458
44	26	1	2	203	busy	Molestiae recusandae super adhuc aufero bellicus acerbitas cometes cunctatio.	https://long-term-glockenspiel.org/	2026-02-07 04:18:02.943568
45	19	3	1	126	wrong_number	Sit adipiscor subiungo synagoga crastinus corona caveo temporibus.	https://guilty-insect.org	2026-02-07 04:18:02.947318
46	50	1	3	504	wrong_number	Alioqui varius dolorum demens conventus sulum aperte.	https://misty-bean.info/	2026-02-07 04:18:02.950648
47	10	5	1	596	voicemail	Solutio ante conitor.	https://grave-contagion.info/	2026-02-07 04:18:02.953968
48	26	2	3	27	connected	Velut cotidie vos arcus animus damnatio debilito facere.	https://overdue-merchant.org	2026-02-07 04:18:02.957014
49	31	3	3	490	connected	Depraedor ulterius vorago accedo reiciendis carbo.	https://caring-spirituality.org	2026-02-07 04:18:02.960838
50	16	4	2	214	connected	Tunc voluptas eligendi sublime tutamen incidunt.	https://compassionate-archeology.biz	2026-02-07 04:18:02.963637
51	32	1	1	571	wrong_number	Porro audeo cognomen decerno cuppedia patria.	https://humongous-tin.name	2026-02-07 04:18:02.967616
52	41	2	3	325	busy	Agnosco ago annus commodi statim pectus tametsi.	https://lovable-armadillo.info/	2026-02-07 04:18:02.969988
53	1	1	1	115	wrong_number	Vado creo impedit amplitudo auxilium bardus capio.	https://worried-peek.biz	2026-02-07 04:18:02.972233
54	18	3	2	292	voicemail	Deporto velit venustas.	https://easy-spring.biz/	2026-02-07 04:18:02.974312
55	28	4	2	219	connected	Caput beneficium ascit eaque.	https://experienced-east.name	2026-02-07 04:18:02.976613
56	28	5	1	414	busy	Cruentus coniuratio caterva solum facilis textor cervus.	https://runny-assignment.net	2026-02-07 04:18:02.979521
57	33	2	3	186	wrong_number	Peccatus delectus cunabula ut comprehendo soleo confido triduana.	https://golden-lunge.biz	2026-02-07 04:18:02.982151
58	9	1	2	117	busy	Summopere ea quaerat canonicus aspicio cultellus cervus vos sunt verus.	https://creepy-dump.info/	2026-02-07 04:18:02.98491
59	17	5	2	172	connected	Adhuc optio tam peior vix.	https://glittering-boatyard.net/	2026-02-07 04:18:02.987389
60	4	1	1	158	busy	Carus caries cena est volo alo casus esse astrum.	https://defensive-angstrom.name	2026-02-07 04:18:02.989926
61	46	5	3	342	busy	Dolorum adsidue censura vestrum vis tonsor victus alias spargo annus.	https://double-suitcase.name	2026-02-07 04:18:02.99256
62	25	3	2	334	wrong_number	Abduco vulnus cursim cumque.	https://relieved-pollutant.info	2026-02-07 04:18:02.99496
63	44	3	2	92	wrong_number	Cruciamentum aiunt quod videlicet damno quas approbo catena.	https://mad-physiology.biz/	2026-02-07 04:18:02.997393
64	20	1	2	97	connected	Quod amplitudo audax tergo deficio confero tam voro hic.	https://idolized-profit.biz/	2026-02-07 04:18:02.999772
65	26	5	2	439	wrong_number	Adimpleo teres tertius sumptus bis pecto amita sophismata consectetur alias.	https://frightening-skate.net	2026-02-07 04:18:03.002343
66	29	1	2	36	busy	Vir paens labore vero arca deputo strenuus sint vereor adulatio.	https://somber-isolation.com	2026-02-07 04:18:03.004457
67	49	4	2	170	voicemail	Abscido vester beneficium quasi.	https://anguished-repair.info	2026-02-07 04:18:03.006816
68	30	3	1	491	connected	Coniuratio vado pauper caries cras.	https://exemplary-landmine.com	2026-02-07 04:18:03.009217
69	35	3	3	544	wrong_number	Repudiandae colo adiuvo terebro conventus aestas corona sufficio alii.	https://phony-dickey.net	2026-02-07 04:18:03.011488
70	28	1	1	519	wrong_number	Defluo apostolus sit deputo sum veritatis infit natus desolo.	https://enchanted-trustee.biz	2026-02-07 04:18:03.013575
71	35	4	3	146	wrong_number	Peccatus desparatus degusto id pauci cum.	https://blind-gravity.com	2026-02-07 04:18:03.015637
72	29	1	2	287	connected	Claustrum astrum demum sopor pecco auxilium suffragium curis doloribus cognomen.	https://total-politics.net/	2026-02-07 04:18:03.023442
73	29	2	2	239	connected	Deserunt capitulus stabilis tener.	https://heartfelt-slip.com	2026-02-07 04:18:03.025557
74	32	2	3	371	connected	Via conqueror commodi attonbitus vobis atrox tero velit.	https://flat-hydrolyse.info/	2026-02-07 04:18:03.027617
75	47	2	2	549	voicemail	Inventore audentia cruciamentum appello adaugeo defetiscor admoveo magni benigne.	https://another-opportunity.org	2026-02-07 04:18:03.029903
76	19	1	3	38	connected	Quam autem tenetur ab summopere sustineo recusandae cado amplitudo.	https://spectacular-smith.name/	2026-02-07 04:18:03.032233
77	26	5	1	337	voicemail	Voluptatibus venustas decor accusamus corpus comminor.	https://wooden-webinar.org	2026-02-07 04:18:03.034658
78	35	3	2	476	busy	Uredo cupiditate capto carmen distinctio repellat supellex.	https://scared-probe.biz	2026-02-07 04:18:03.03692
79	5	2	1	512	connected	Cohors deduco urbanus varietas.	https://young-reprocessing.com/	2026-02-07 04:18:03.039133
80	26	2	2	395	busy	Vel abstergo cotidie caveo ter.	https://lucky-bat.info	2026-02-07 04:18:03.041451
81	21	4	1	25	busy	Derelinquo fugiat delibero ab approbo.	https://inborn-jalapeno.biz	2026-02-07 04:18:03.043785
82	5	3	3	380	busy	Artificiose ascisco totus tabgo.	https://neglected-enigma.net/	2026-02-07 04:18:03.046025
83	45	4	2	538	wrong_number	Tredecim solitudo blanditiis officiis stillicidium vesper.	https://unwieldy-pupa.info	2026-02-07 04:18:03.048193
84	23	4	3	393	wrong_number	Bene dolorem comis.	https://oily-serum.name/	2026-02-07 04:18:03.050445
85	15	3	3	261	wrong_number	Dedico capto vomica aureus illum cervus celebrer universe cubitum arma.	https://digital-combination.name	2026-02-07 04:18:03.052682
86	44	3	2	54	busy	Viscus cariosus turba angustus infit tabgo thalassinus apud tutis derideo.	https://rubbery-wet-bar.com	2026-02-07 04:18:03.05497
87	20	5	3	376	wrong_number	Utilis desipio decerno caterva aegrus.	https://gracious-grease.com/	2026-02-07 04:18:03.057389
88	3	3	3	41	busy	Taedium atavus alius advoco tamquam.	https://rigid-stupidity.name	2026-02-07 04:18:03.059958
89	36	5	3	337	connected	Sol demitto solus.	https://dual-answer.com	2026-02-07 04:18:03.062458
90	48	5	2	482	connected	Valeo arto adulescens sublime amiculum occaecati confido.	https://decisive-affair.biz	2026-02-07 04:18:03.064518
91	26	3	3	135	voicemail	Voluptatem una absque solium.	https://experienced-opera.biz	2026-02-07 04:18:03.066845
92	23	2	2	140	connected	Alioqui culpo aranea cena reprehenderit.	https://submissive-heritage.com/	2026-02-07 04:18:03.069485
93	18	4	3	340	voicemail	Abeo benevolentia curriculum sublime vulpes sonitus virtus.	https://plush-temporary.org/	2026-02-07 04:18:03.07215
94	45	4	1	115	connected	Apparatus commodi artificiose calamitas ipsa voluptate civitas.	https://exalted-mining.biz/	2026-02-07 04:18:03.075031
95	43	1	2	404	wrong_number	Theca absque animi pecco aegrotatio sono.	https://honest-competence.net/	2026-02-07 04:18:03.077988
96	42	2	2	115	busy	Tondeo tristis curis deficio curia animi curso vulgivagus spiculum.	https://welcome-loss.info/	2026-02-07 04:18:03.080759
97	7	4	2	394	connected	Cibus colo accusator.	https://original-filter.name/	2026-02-07 04:18:03.083395
98	13	4	3	510	busy	Tero attero dolorum bis vitae vesper cursim vel.	https://svelte-reserve.com	2026-02-07 04:18:03.085977
99	28	2	1	147	voicemail	Speculum communis usus arbor adduco casso solus.	https://colorful-head.biz	2026-02-07 04:18:03.08861
100	30	4	2	294	voicemail	Vergo capillus voco audentia.	https://gigantic-sister-in-law.com/	2026-02-07 04:18:03.091885
\.


--
-- Data for Name: campaigns; Type: TABLE DATA; Schema: public; Owner: frost_admin
--

COPY public.campaigns (id, name, description, start_date, end_date, status, created_at) FROM stdin;
1	Fantastic Granite Shoes Launch	Similique teres careo calcar depono trado corona asporto voluptatum toties.	2025-09-13	\N	active	2026-02-07 04:18:02.72824
2	Electronic Frozen Pizza Launch	Subseco sustineo absconditus campana curvo tener considero tabella ut.	2025-10-19	\N	active	2026-02-07 04:18:02.732369
3	Electronic Rubber Fish Launch	Cattus adfero alius ut tamen virgo utrum casso decumbo calco.	2025-10-18	\N	active	2026-02-07 04:18:02.739354
\.


--
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: frost_admin
--

COPY public.contacts (id, first_name, last_name, email, phone, company, status, created_at) FROM stdin;
1	Tre	Deckow	Ciara56@yahoo.com	937-421-7084 x56356	Kozey and Sons	customer	2026-02-07 04:18:02.60737
2	Liana	Connelly	Garland72@gmail.com	1-389-917-7469 x2336	Sipes, Russel and Barrows	new	2026-02-07 04:18:02.6118
3	Maya	Thompson	Jany49@yahoo.com	400-934-4736 x7360	Zulauf, Gibson and Konopelski	customer	2026-02-07 04:18:02.614026
4	Mara	Fritsch	Letitia_Littel@hotmail.com	991-279-4504 x45526	Anderson Group	qualified	2026-02-07 04:18:02.616335
5	Colt	Schaefer	Bernita.Cummings26@yahoo.com	1-412-280-5538 x9569	Christiansen LLC	new	2026-02-07 04:18:02.618896
6	Kacey	Pacocha	Christina.Borer@yahoo.com	855.449.4602 x26610	Keebler - Wolf	new	2026-02-07 04:18:02.621232
7	Corene	Hand	Garland5@gmail.com	1-430-512-4900	Hand, Hettinger and Pacocha	qualified	2026-02-07 04:18:02.623456
8	Noel	Lockman	Duane.Kozey70@yahoo.com	(947) 646-4562 x0198	Schultz - Lindgren	contacted	2026-02-07 04:18:02.62585
9	Luigi	Smith	Kiley_Kertzmann@gmail.com	890.262.4088 x4493	Franey, Leffler and Little	customer	2026-02-07 04:18:02.628031
10	Arvel	Kling	Berry_Wolff75@hotmail.com	491-924-9070	Kutch, Mayert and Stiedemann	contacted	2026-02-07 04:18:02.630347
11	Lilly	Keebler	Kieran1@hotmail.com	615-717-1161 x14451	Ondricka Inc	new	2026-02-07 04:18:02.632613
12	Rozella	Blick	Jerald.Swaniawski-Roberts87@hotmail.com	736.830.5007 x6717	Larkin - Kihn	churned	2026-02-07 04:18:02.635093
13	Joan	Padberg	Weldon.Cummerata35@hotmail.com	(491) 887-4516 x4484	Jacobs - McCullough	new	2026-02-07 04:18:02.637766
14	Trevion	Thiel	Scot73@hotmail.com	776-743-7146 x30681	Zemlak - Nitzsche	churned	2026-02-07 04:18:02.640588
15	Eloy	Parisian	Deanna83@yahoo.com	1-455-771-6149	Stamm - Willms	qualified	2026-02-07 04:18:02.642917
16	Jaren	Will	Verda_Dickinson56@yahoo.com	1-208-629-3443 x6417	Halvorson, Feest and Walsh	qualified	2026-02-07 04:18:02.645176
17	Lavon	Gutmann	Christa.Ritchie@hotmail.com	(278) 517-8131 x592	Parisian Group	qualified	2026-02-07 04:18:02.647429
18	Adella	McDermott	Alba_Altenwerth65@gmail.com	260-709-9139	Metz Group	churned	2026-02-07 04:18:02.649788
19	Kyle	Olson	Carolyn.Lind@yahoo.com	(930) 904-5911 x376	Gislason Group	customer	2026-02-07 04:18:02.652297
20	Lavada	Heidenreich	Everett.Hand@gmail.com	(695) 435-4047 x5582	Abshire, Braun and DuBuque	new	2026-02-07 04:18:02.65445
21	Beaulah	Padberg	Conner.Ruecker@hotmail.com	443.846.5975	McCullough, Funk and Mayert	contacted	2026-02-07 04:18:02.656901
22	Arlene	Kozey	Osbaldo.Kirlin@gmail.com	1-383-406-9042 x639	Langosh - Fadel	qualified	2026-02-07 04:18:02.659687
23	Tristian	Hyatt	Sadie.Waters@hotmail.com	1-715-462-8707 x1383	Carroll - Lueilwitz	new	2026-02-07 04:18:02.662051
24	Alia	Runolfsdottir	Lavada.Kling@hotmail.com	315.210.7169 x7959	Hilll, Dietrich and Gislason	customer	2026-02-07 04:18:02.664446
25	Mallory	Lebsack	Carlie_Reinger3@hotmail.com	(708) 354-3340 x4852	Berge, Renner and Marks	qualified	2026-02-07 04:18:02.66698
26	Salma	Gerhold	Leslie.Schaefer10@hotmail.com	242.624.5886 x92477	Corkery - Raynor	customer	2026-02-07 04:18:02.669368
27	Moses	Buckridge-Sawayn	Keira.Watsica-Schneider19@yahoo.com	(273) 401-0721	Nienow - Kihn	qualified	2026-02-07 04:18:02.671761
28	Uriah	Keebler	Marques_DuBuque91@yahoo.com	441-519-0804 x161	Legros, Gerlach and Langworth	contacted	2026-02-07 04:18:02.674209
29	Morgan	Wisozk	Darian_Flatley@hotmail.com	692.963.8331	Sawayn Inc	contacted	2026-02-07 04:18:02.676912
30	Eugene	Tillman	Guadalupe52@yahoo.com	430.924.6939 x60113	Volkman, Senger and Fay	new	2026-02-07 04:18:02.679339
31	August	Robel	Merlin.Ritchie@gmail.com	776.805.3689 x665	Boyle LLC	churned	2026-02-07 04:18:02.681678
32	Vallie	Cruickshank	Bernardo.Prosacco@gmail.com	423.271.0900 x426	Pagac Group	new	2026-02-07 04:18:02.684279
33	Timmy	Cormier	David.Pfeffer75@gmail.com	1-759-570-1341	Stark - Lehner	contacted	2026-02-07 04:18:02.686599
34	Maurice	Hahn-Turcotte	Oswald90@yahoo.com	1-724-524-2093	Kreiger Group	new	2026-02-07 04:18:02.688944
35	Merlin	Raynor	Norbert_Klein@gmail.com	(945) 919-2259	Morissette, Davis and Bernier	new	2026-02-07 04:18:02.691138
36	Matilda	Muller	Kenneth.Fay40@gmail.com	471.846.1783 x5414	Huels, Bradtke and Hessel	new	2026-02-07 04:18:02.693367
37	Clarabelle	Stanton	Elijah41@hotmail.com	756.696.3398 x26064	Reinger - Price	churned	2026-02-07 04:18:02.695885
38	Carrie	Wintheiser	Lauren28@hotmail.com	(493) 285-3430 x806	Lynch, Kling and Steuber	churned	2026-02-07 04:18:02.698124
39	Tad	Schulist	Wilbert.Thiel@gmail.com	755.246.2090 x8837	Schuppe - Friesen	qualified	2026-02-07 04:18:02.700471
40	Felicia	Gleichner	Connor_Breitenberg@yahoo.com	1-389-548-0904 x1255	Weimann Inc	qualified	2026-02-07 04:18:02.702683
41	Carolanne	Rau	Krystal.Carter@hotmail.com	753-247-4608	Breitenberg, Hessel and Kertzmann	customer	2026-02-07 04:18:02.704862
42	Ettie	Pagac	Lois.Waters86@hotmail.com	701-994-3090 x7352	Lebsack - Ratke	qualified	2026-02-07 04:18:02.707473
43	Kaitlin	Cole	Reese_Jones36@yahoo.com	(935) 722-2666 x3024	Corwin, Hickle and Klocko	new	2026-02-07 04:18:02.709535
44	Kirk	Grimes	Jany.Kertzmann20@gmail.com	463-891-4143	Langworth - Gislason	qualified	2026-02-07 04:18:02.712004
45	Izabella	Cole-Boyle	Clinton34@hotmail.com	1-267-537-9942 x7272	Jacobson - Bruen	contacted	2026-02-07 04:18:02.714268
46	Forest	Wehner	Murray_Doyle96@hotmail.com	884.637.0951 x152	Heidenreich - Schmitt	contacted	2026-02-07 04:18:02.716703
47	Vicente	Bauch	Lane.Borer53@gmail.com	460-894-1520 x43932	Torphy Inc	new	2026-02-07 04:18:02.719064
48	Chelsea	Moen	Quinton.Pfeffer@yahoo.com	1-686-678-0741 x1625	Denesik, Yost and Hilll	qualified	2026-02-07 04:18:02.721273
49	Sadye	Boehm	Wallace24@gmail.com	1-483-293-5305	Stehr Inc	contacted	2026-02-07 04:18:02.723366
50	Elyse	Lakin	Thurman.Abshire91@hotmail.com	845.520.3179 x221	Littel LLC	new	2026-02-07 04:18:02.725669
\.


--
-- Data for Name: scripts; Type: TABLE DATA; Schema: public; Owner: frost_admin
--

COPY public.scripts (id, title, content, campaign_id, created_at) FROM stdin;
1	Cold Call Script V1	Tonsor supplanto suspendo cognomen distinctio ciminatio ullam. Creta timidus apparatus caput consectetur deputo. Appello decerno ambulo vulgivagus tardus amaritudo ex coerceo.\nVinco desparatus admoveo validus aptus tamisium paulatim cum considero. Comparo quas subseco supplanto careo defero repellendus arceo spes. Basium denique aqua sto.	1	2026-02-07 04:18:02.741817
2	Cold Call Script V1	Viduo cervus benevolentia dicta amita suasoria adinventitias. Acerbitas conatus color angelus clibanus correptius votum aqua campana delinquo. Umquam timor arbustum harum thesaurus cum perferendis vociferor creta bos.\nPaulatim adicio crebro. Dolorem assumenda impedit crur angustus. Valde cubitum vergo expedita vomica vir dolorem canis paens.	2	2026-02-07 04:18:02.74723
3	Cold Call Script V1	Abstergo defaeco comburo alius sustineo demitto valens magni. Tondeo summopere vobis terebro crinis facilis. Quaerat succurro a cunctatio aro dolores crudelis.\nNecessitatibus decumbo quam decor atque vel sufficio vallum creta. Vestrum voveo assentator cohibeo nobis. Sonitus tametsi victoria agnosco minima quo charisma.	3	2026-02-07 04:18:02.750216
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: frost_admin
--

COPY public.users (id, username, email, password_hash, role, status, created_at) FROM stdin;
1	Dawson29	Dakota.Hirthe@gmail.com	HjSJeCKq8qVaJz_	admin	active	2026-02-07 04:18:02.590165
2	Clara28	Karolann53@gmail.com	uz8ueo1yqot52Kx	agent	active	2026-02-07 04:18:02.596919
3	Crawford.Larkin-Fadel	Hildegard.Bahringer67@hotmail.com	RiIisl2sdzlEw6K	agent	active	2026-02-07 04:18:02.599464
4	Bennett_Bogan	Melany_Keeling@hotmail.com	eh9HJmphe9pxHm9	agent	active	2026-02-07 04:18:02.602331
5	Lloyd_Effertz88	Emily_Osinski@hotmail.com	i2bXUPxW7jxRodu	agent	active	2026-02-07 04:18:02.604845
6	AgentSmith	agent@globaldialer.com	password123	agent	active	2026-02-07 04:59:43.137958
\.


--
-- Name: calls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: frost_admin
--

SELECT pg_catalog.setval('public.calls_id_seq', 100, true);


--
-- Name: campaigns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: frost_admin
--

SELECT pg_catalog.setval('public.campaigns_id_seq', 3, true);


--
-- Name: contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: frost_admin
--

SELECT pg_catalog.setval('public.contacts_id_seq', 50, true);


--
-- Name: scripts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: frost_admin
--

SELECT pg_catalog.setval('public.scripts_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: frost_admin
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- Name: calls calls_pkey; Type: CONSTRAINT; Schema: public; Owner: frost_admin
--

ALTER TABLE ONLY public.calls
    ADD CONSTRAINT calls_pkey PRIMARY KEY (id);


--
-- Name: campaigns campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: frost_admin
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (id);


--
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: frost_admin
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


--
-- Name: scripts scripts_pkey; Type: CONSTRAINT; Schema: public; Owner: frost_admin
--

ALTER TABLE ONLY public.scripts
    ADD CONSTRAINT scripts_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: frost_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: frost_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: frost_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: calls calls_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: frost_admin
--

ALTER TABLE ONLY public.calls
    ADD CONSTRAINT calls_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id);


--
-- Name: calls calls_contact_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: frost_admin
--

ALTER TABLE ONLY public.calls
    ADD CONSTRAINT calls_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES public.contacts(id);


--
-- Name: calls calls_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: frost_admin
--

ALTER TABLE ONLY public.calls
    ADD CONSTRAINT calls_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: scripts scripts_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: frost_admin
--

ALTER TABLE ONLY public.scripts
    ADD CONSTRAINT scripts_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id);


--
-- PostgreSQL database dump complete
--

\unrestrict bIhg2psGlCh4PmlsVOowj3I8Z20IJ62QP53Y5mdaCk8NE1RkXKCdh51BKsSe89c

