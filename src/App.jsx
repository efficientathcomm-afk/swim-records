import React, { useState, useMemo, useRef } from 'react';
import {
  Upload,
  FileText,
  Download,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Users,
  Trophy,
  Timer,
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Waves,
  ArrowUpDown,
  X,
  Play,
  Layers,
  TrendingUp,
  Zap,
  Award,
  Medal,
  Database,
  Sparkles,
  Copy,
  Check,
  Trash2,
  Star,
  BookOpen,
  PlusCircle,
  CheckCheck,
  Home,
  Radio,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  Link2,
  Building2,
  UserPlus
} from 'lucide-react';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9wvEBlxlufBiktja5vjaXH0rxceCuPyg",
  authDomain: "swimming-records.firebaseapp.com",
  projectId: "swimming-records",
  storageBucket: "swimming-records.firebasestorage.app",
  messagingSenderId: "645635780769",
  appId: "1:645635780769:web:f9b5bb16397b3a0ec980e0",
  measurementId: "G-TY22D1ZJWM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ============================================================================
// SAMPLE SDIF / CL2 DATA (Complete Gettysburg v Carnegie Mellon - 07Nov2026)
// ============================================================================
const SAMPLE_CL2_DATA = `A03V3      02Meet Results                  Hy-Tek, Ltd         WMM 8.0Gh Hy-Tek, Ltd         866-456-511111072026                                    MM40    N52
B13        Gettysburg v Carnegie Mellon                                              Gettysburg          PA17325     USA 1107202611072026   0        Y 000   N05
C13AM      AMCMU Carnegie Mellon University                    5000 Forbes Ave                                                 PA          USA               N03
D03AM  SO  Chen, Andrew                CA5865516725A   1030200620MM  501 14 UNOV11072026                              22.44Y     1 8     7       7  01      NN09
D3CA58655167254EAndrew                                                                                                                                       N61
D03AM  SO  Chen, Andrew                CA5865516725A   1030200620MM 1001 16 UNOV11072026                              48.76Y     1 2     4  2.   4  0100    NN49
G03AM          Chen, Andrew                CA58655167251 2  50C   23.70   48.76                                                                F             N05
D03AM  FR  Chen, Sarah Y               CA09F5D4110BA   1226200718FF 1002  7 UNOV11072026                              58.53Y     1 4     1  9.   1  0200    NN39
D3CA09F5D4110B49Sarah                                                                                                                                        N21
G03AM          Chen, Sarah Y               CA09F5D4110B1 2  50C   28.81   58.53                                                                F             N05
D03AM  FR  Chen, Sarah Y               CA09F5D4110BA   1226200718FF 2002 17 UNOV11072026                            2:08.77Y     1 4     1  9.   1  0200    NN69
G03AM          Chen, Sarah Y               CA09F5D4110B1 4  50C   30.37 1:03.16 1:35.86 2:08.77                                                F             N76
D03AM  FR  Chen, Ziyu                  E9C81A13B32CA   0718200818FF 1003  9 UNOV11072026                            1:07.34Y     1 4     1  9.   1  0300    NN19
D3E9C81A13B32C49Zoe                                                                                                                                          N60
G03AM          Chen, Ziyu                  E9C81A13B32C1 2  50C   31.78 1:07.34                                                F             N84
D03AM  FR  Chen, Ziyu                  E9C81A13B32CA   0718200818FF 2003 19 UNOV11072026                            2:30.25Y     1 2     3  3.   3  0300    NN19
G03AM          Chen, Ziyu                  E9C81A13B32C1 4  50C   34.49 1:12.38 1:51.72 2:30.25                                                F             N26
D03AM  FR  Chung, Jimin                F8528C9DB494A   1224200718MM 2004 12 UNOV11072026                            1:51.35Y     1 4     2  4.   2  0400    NN99
D3F8528C9DB4944BJimin                                                                                                                                        N41
G03AM          Chung, Jimin                F8528C9DB4941 4  50C   25.49   54.31 1:23.29 1:51.35                                                F             N76
D03AM  FR  Chung, Jimin                F8528C9DB494A   1224200718MM 4005 26 UNOV11072026                            4:07.78Y     1 2     2  4.   2  0500    NN00
G03AM          Chung, Jimin                F8528C9DB4941 8  50C   25.94   55.02 1:26.99 1:58.14 2:33.50 3:09.41 3:39.26 4:07.78                F             N79
D03AM  FR  De Fabrique, Paolo          77606738F69CA   1022200719MM 1002  8 UNOV11072026                              56.85Y     1 8     7       7  02      NN90
D377606738F69C46Paolo                                                                                                                                        N21
G03AM          De Fabrique, Paolo          77606738F69C1 2  50C   28.03   56.85                                                                F             N86
D03AM  FR  De Fabrique, Paolo          77606738F69CA   1022200719MM 2002 18 UNOV11072026                            2:03.99Y     1 8     6       6  02      NN21
G03AM          De Fabrique, Paolo          77606738F69C1 4  50C   29.40 1:01.13 1:32.70 2:03.99                                                F             N48
D03AM  SO  Doan, Tran B                1D8D1F9CA823A   1024200719FF 1003  9 UNOV11072026                            1:08.27Y     1 2     2  4.   2  0300    NN29
D31D8D1F9CA8234ATran                                                                                                                                         N01
G03AM          Doan, Tran B                1D8D1F9CA8231 2  50C   31.94 1:08.27                                                                F             N94
D03AM  SO  Doan, Tran B                1D8D1F9CA823A   1024200719FF 1004 23 UNOV11072026                              59.96Y     1 6     4  2.   4  0400    NN19
G03AM          Doan, Tran B                1D8D1F9CA8231 2  50C   27.88   59.96                                                                F             N74
D03AM  FR  Flanagan, Annie             6C8F2D47CECCA   1022200719FF 2001  5 UNOV11072026                            2:02.28Y     1 2     6       6  01      NN50
D36C8F2D47CECC46Annie                                                                                                                                        N51
G03AM          Flanagan, Annie             6C8F2D47CECC1 4  50C   28.42   59.69 1:31.27 2:02.28                                                F             N97
D03AM  FR  Flanagan, Annie             6C8F2D47CECCA   1022200719FF 1001 15 UNOV11072026                              56.91Y     1 2     6       6  01      NN40
G03AM          Flanagan, Annie             6C8F2D47CECC1 2  50C   27.01   56.91                                                                F             N46
D03AM  SO  Gil, Audrey L               6055FC4F0DA4A   0911200719FF  501 13 UNOV11072026                              24.21Y     1 4     1  9.   1  0100    NN49
D36055FC4F0DA44FAudrey                                                                                                                                       N81
D03AM  SO  Gil, Audrey L               6055FC4F0DA4A   0911200719FF 1004 23 UNOV11072026                              57.33Y     1 4     1  9.   1  0400    NN59
G03AM          Gil, Audrey L               6055FC4F0DA41 2  50C   27.10   57.33                                                                F             N05
D03AM  FR  Gossmann, Roberto           9535A0AC3F9BA   0617200719MM 2001  6 UNOV11072026                            1:47.20Y     1 4     5  1.   5  0100    NN91
D39535A0AC3F9B4CRoberto                                                                                                                                      N32
G03AM          Gossmann, Roberto           9535A0AC3F9B1 4  50C   25.19   52.52 1:19.98 1:47.20                                                F             N98
D03AM  FR  Gossmann, Roberto           9535A0AC3F9BA   0617200719MM 1001 16 UNOV11072026                              48.37Y     1 4     3  3.   3  0100    NN81
G03AM          Gossmann, Roberto           9535A0AC3F9B1 2  50C   23.23   48.37                                                                F             N47
D03AM  SO  Gregory, Julia A            42B52091CC66A   0411200719FF  501 13 UNOV11072026                              25.95Y     1 8     7       7  01      NN10
D342B52091CC664AJulia                                                                                                                                        N21
D03AM  SO  Gregory, Julia A            42B52091CC66A   0411200719FF 1004 23 UNOV11072026                            1:05.18Y     1 2     8       8  04      NN40
G03AM          Gregory, Julia A            42B52091CC661 2  50C   29.83 1:05.18                                                                F             N36
D03AM  SO  Gu, Zhehan                  1175C4EB2E7DA   0511200719MM 2001  6 UNOV11072026                            1:44.14Y     1 6     1  9.   1  0100    NN19
D31175C4EB2E7D4CMax                                                                                                                                          N60
G03AM          Gu, Zhehan                  1175C4EB2E7D1 4  50C   24.70   51.18 1:17.82 1:44.14                                                F             N95
D03AM  SO  Gu, Zhehan                  1175C4EB2E7DA   0511200719MM 1001 16 UNOV11072026                              47.41Y     1 6     2  4.   2  0100    NN98
G03AM          Gu, Zhehan                  1175C4EB2E7D1 2  50C   23.09   47.41                                                                F             N44
D03AM  SR  Haraldsson, Miles T         317FF48C016BA   1101200422MM10001  4 UNOV11072026                           10:01.66Y     1 2     3  3.   3  0100    NN12
D3317FF48C016B4DMiles                                                                                                                                        N31
G03AM          Haraldsson, Miles T         317FF48C016B120  50C   27.06   56.68 1:26.99 1:57.42 2:27.67 2:58.18 3:28.57 3:59.04 4:29.56 4:59.83F             N63
G03AM          Haraldsson, Miles T         317FF48C016B220  50C 5:30.22 6:00.60 6:30.72 7:00.96 7:31.35 8:01.65 8:31.87 9:02.14 9:32.3410:01.66F             N93
D03AM  SR  Haraldsson, Miles T         317FF48C016BA   1101200422MM 5001 22 UNOV11072026                            4:59.79Y     1 8     5       5  01      NN81
G03AM          Haraldsson, Miles T         317FF48C016B110  50C   26.91   56.51 1:26.99 1:57.60 2:28.35 2:58.81 3:29.64 4:00.07 4:30.23 4:59.79F             N53
D03AM  FR  Hunter, Brock S             F8AC4D07901DA   1124200718MM  501 14 UNOV11072026                              21.14Y     1 2     3  3.   3  0100    NN20
D3F8AC4D07901DAABrock                                                                                                                                        N41
D03AM  JR  Kim, Allie Y                C11CE1E59D41A   0718200620FF 1002  7 UNOV11072026                            1:01.41Y     1 2     3  3.   3  0200    NN19
D3C11CE1E59D4149Allie                                                                                                                                        N21
G03AM          Kim, Allie Y                C11CE1E59D411 2  50C   29.87 1:01.41                                                                F             N94
D03AM  JR  Kim, Allie Y                C11CE1E59D41A   0718200620FF 2002 17 UNOV11072026                            2:13.75Y     1 8     2  4.   2  0200    NN39
G03AM          Kim, Allie Y                C11CE1E59D411 4  50C   31.72 1:05.55 1:39.66 2:13.75                                                F             N36
D03AM  FR  Kueh, Michael               9835351D2C34A   0124200818MM 2004 12 UNOV11072026                            1:55.98Y     1 2     3  3.   3  0400    NN00
D39835351D2C3448Michael                                                                                                                                      N71
G03AM          Kueh, Michael               9835351D2C341 4  50C   26.45   56.45 1:26.30 1:55.98                                                F             N86
D03AM  FR  Kueh, Michael               9835351D2C34A   0124200818MM 1004 24 UNOV11072026                              52.33Y     1 2     3  3.   3  0400    NN79
G03AM          Kueh, Michael               9835351D2C341 2  50C   24.61   52.33                                                                F             N25
D03AM  SR  Lathrop, Austin             205585D07FA0A   0929200521MM 1002  8 UNOV11072026                              54.80Y     1 2     5  1.   5  0200    NN80
D3205585D07FA040Austin                                                                                                                                       N61
G03AM          Lathrop, Austin             205585D07FA01 2  50C   26.65   54.80                                                                F             N46
D03AM  SR  Lathrop, Austin             205585D07FA0A   0929200521MM 1004 24 UNOV11072026                              53.61Y     1 6     5  1.   5  0400    NN90
G03AM          Lathrop, Austin             205585D07FA01 2  50C   25.00   53.61                                                                F             N36
D03AM  FR  Lee, Cherry                 4296C8206084A   1220200718FF 1003  9 UNOV11072026                            1:10.93Y     1 8     6       6  03      NN78
D34296C820608440Cherry                                                                                                                                       N41
G03AM          Lee, Cherry                 4296C82060841 2  50C   34.03 1:10.93                                                                F             N74
D03AM  FR  Lee, Cherry                 4296C8206084A   1220200718FF 2003 19 UNOV11072026                            2:30.94Y     1 6     4  2.   4  0300    NN19
G03AM          Lee, Cherry                 4296C82060841 4  50C   35.07 1:12.07 1:51.14 2:30.94                                                F             N16
D03AM  FR  Lee, Cherry                 4296C8206084A   1220200718FF 4005 25 UNOV11072026                            4:49.41Y     1 2     3  3.   3  0500    NN19
G03AM          Lee, Cherry                 4296C82060841 8  50C   31.13 1:06.86 1:45.25 2:23.04 3:02.25 3:42.91 4:16.39 4:49.41                F             N19
D03AM  FR  Liu, Matthew J              42E096107EABA   0121200818MM 1003 10 UNOV11072026                              58.33Y     1 6     2  4.   2  0300    NN99
D342E096107EAB48Matthew                                                                                                                                      N12
G03AM          Liu, Matthew J              42E096107EAB1 2  50C   28.01   58.33                                                                F             N45
D03AM  FR  Liu, Matthew J              42E096107EABA   0121200818MM 4005 26 UNOV11072026                            4:04.49Y     1 6     1  9.   1  0500    NN20
G03AM          Liu, Matthew J              42E096107EAB1 8  50C   25.93   54.71 1:27.15 1:59.43 2:33.13 3:07.63 3:36.19 4:04.49                F             N99
D03AM  JR  Lu, Janna Antoinette        839AF8FC2FD4A   1016200620FF 1001 15 UNOV11072026                              55.99Y     1 8     5  1.   5  0100    NN42
D3839AF8FC2FD444Janna                                                                                                                                        N41
G03AM          Lu, Janna Antoinette        839AF8FC2FD41 2  50C   26.96   55.99                                                                F             N18
D03AM  JR  Lu, Janna Antoinette        839AF8FC2FD4A   1016200620FF  501 13 UNOV11072026                              25.39Y     1 2     5  1.   5  0100    NN32
D03AM  SO  Luebke, Alexandre W         94C13BB285E8A   0808200719MM 2001  6 UNOV11072026                            1:44.41Y     1 2     2  4.   2  0100    NN91
D394C13BB285E849Alex                                                                                                                                         N90
G03AM          Luebke, Alexandre W         94C13BB285E81 4  50C   25.10   51.74 1:18.01 1:44.41                                                F             N78
D03AM  SO  Luebke, Alexandre W         94C13BB285E8A   0808200719MM 1001 16 UNOV11072026                              49.22Y     1 8     6       6  01      NN51
G03AM          Luebke, Alexandre W         94C13BB285E81 2  50C   23.68   49.22                                                                F             N37
D03AM  SR  Morford, Brayden S          0BDCB954833BA   1115200421MM  501 14 UNOV11072026                              20.74Y     1 4     1  9.   1  0100    NN41
D30BDCB954833B48Brayden                                                                                                                                      N12
D03AM  SR  Morford, Brayden S          0BDCB954833BA   1115200421MM 1004 24 UNOV11072026                              49.56Y     1 4     1  9.   1  0400    NN61
G03AM          Morford, Brayden S          0BDCB954833B1 2  50C   23.46   49.56                                                                F             N17
D03AM  SO  Muncy, Madeline J           016D42289322A   1007200719FF  501 13 UNOV11072026                              25.54Y     1 6     6       6  01      NN30
D3016D4228932243Maddie                                                                                                                                       N21
D03AM  FR  Peitler, Matthew            6ACE1074C0B6A   0813200620MM  501 14 UNOV11072026                              21.10Y     1 6     2  4.   2  0100    NN11
D36ACE1074C0B644Matt                                                                                                                                         N90
D03AM  SO  Quach, Harrison T           B8B38F219104A   1004200521MM 1003 10 UNOV11072026                              59.53Y     1 2     3  3.   3  0300    NN01
D3B8B38F2191044BHarrison                                                                                                                                     N52
G03AM          Quach, Harrison T           B8B38F2191041 2  50C   28.35   59.53                                                                F             N66
D03AM  SO  Quach, Harrison T           B8B38F219104A   1004200521MM 2003 20 UNOV11072026                            2:10.02Y     1 6     1  9.   1  0300    NN11
G03AM          Quach, Harrison T           B8B38F2191041 4  50C   29.56 1:02.44 1:35.98 2:10.02                                                F             N28
D03AM  SR  Quan, Jacob M               DA82DCDEBB66A   1119200421MM10001  4 UNOV11072026                            9:53.48Y     1 4     2  4.   2  0100    NN00
D3DA82DCDEBB6640Jacob                                                                                                                                        N41
G03AM          Quan, Jacob M               DA82DCDEBB66120  50C   26.21   54.76 1:24.02 1:53.92 2:23.93 2:54.08 3:24.31 3:54.40 4:24.49 4:54.76F             N21
G03AM          Quan, Jacob M               DA82DCDEBB66220  50C 5:25.67 5:56.00 6:26.56 6:56.83 7:27.00 7:56.27 8:26.06 8:55.14 9:24.68 9:53.48F             N91
D03AM  SR  Quan, Jacob M               DA82DCDEBB66A   1119200421MM 5001 22 UNOV11072026                            4:43.76Y     1 4     2  4.   2  0100    NN00
G03AM          Quan, Jacob M               DA82DCDEBB66110  50C   26.06   54.03 1:22.77 1:51.99 2:21.02 2:49.66 3:18.30 3:47.09 4:15.98 4:43.76F             N21
D03AM  SR  Raich, Catrina M            3BF36E992AA5A   0829200521FF10001  3 UNOV11072026                           11:18.76Y     1 2     5  2.   5  0100    NN90
D33BF36E992AA54CCatrina                                                                                                                                      N12
G03AM          Raich, Catrina M            3BF36E992AA5120  50C   31.04 1:04.63 1:38.55 2:12.64 2:47.05 3:20.97 3:55.23 4:29.52 5:03.69 5:37.85F             N32
G03AM          Raich, Catrina M            3BF36E992AA5220  50C 6:11.93 6:46.16 7:20.70 7:54.93 8:29.16 9:03.43 9:37.9510:12.0510:45.9811:18.76F             N03
D03AM  SR  Raich, Catrina M            3BF36E992AA5A   0829200521FF 5001 21 UNOV11072026                            5:30.68Y     1 2     5  1.   5  0100    NN80
G03AM          Raich, Catrina M            3BF36E992AA5110  50C   30.73 1:03.54 1:36.82 2:10.64 2:44.51 3:18.19 3:51.80 4:25.50 4:58.96 5:30.68F             N32
D03AM  JR  Rosenberg, Elizabeth S      944B02EDF253A   1212200520FF 1004 23 UNOV11072026                            1:03.72Y     1 8     7       7  04      NN82
D3944B02EDF25348Lizzy                                                                                                                                        N51
G03AM          Rosenberg, Elizabeth S      944B02EDF2531 2  50C   29.27 1:03.72                                                                F             N88
D03AM  FR  Schmid, Aaron Z             1F29228D3A76A   0401200818MM 1003 10 UNOV11072026                            1:01.71Y     1 8     6       6  03      NN00
D31F29228D3A7648Aaron                                                                                                                                        N21
G03AM          Schmid, Aaron Z             1F29228D3A761 2  50C   28.87 1:01.71                                                                F             N95
D03AM  FR  Schmid, Aaron Z             1F29228D3A76A   0401200818MM 2003 20 UNOV11072026                            2:13.27Y     1 8     3  3.   3  0300    NN30
G03AM          Schmid, Aaron Z             1F29228D3A761 4  50C   29.96 1:03.67 1:38.15 2:13.27                                                F             N47
D03AM  SR  Shaffer, Elizabeth L        55398D6F685DA   0712200521FF 1003  9 UNOV11072026                            1:09.04Y     1 6     4  2.   4  0300    NN22
D355398D6F685D4FElizabeth                                                                                                                                    N92
G03AM          Shaffer, Elizabeth L        55398D6F685D1 2  50C   33.05 1:09.04                                                                F             N87
D03AM  SR  Shaffer, Elizabeth L        55398D6F685DA   0712200521FF 2003 19 UNOV11072026                            2:27.76Y     1 4     2  4.   2  0300    NN32
G03AM          Shaffer, Elizabeth L        55398D6F685D1 4  50C   34.15 1:11.66 1:49.67 2:27.76                                                F             N49
D03AM  SO  Sierzanowski, Natalie J     C6F3DD033018A   0310200719FF 1002  7 UNOV11072026                            1:02.25Y     1 6     4  2.   4  0200    NN53
D3C6F3DD0330184CNatalie                                                                                                                                      N02
G03AM          Sierzanowski, Natalie J     C6F3DD0330181 2  50C   30.07 1:02.25                                                                F             N29
D03AM  SO  Sierzanowski, Natalie J     C6F3DD033018A   0310200719FF 2002 17 UNOV11072026                            2:19.30Y     1 2     6       6  02      NN33
G03AM          Sierzanowski, Natalie J     C6F3DD0330181 4  50C   34.17 1:09.21 1:44.12 2:19.30                                                F             N60
D03AM  SO  Smittle, Katelyn E          57C1421F9DC4A   1222200619FF 2004 11 UNOV11072026                            2:18.53Y     1 4     5  2.   5  0400    NN71
D357C1421F9DC445Katelyn                                                                                                                                      N12
G03AM          Smittle, Katelyn E          57C1421F9DC41 4  50C   30.03 1:04.67 1:41.23 2:18.53                                                F             N78
D03AM  SO  Smittle, Katelyn E          57C1421F9DC4A   1222200619FF 5001 21 UNOV11072026                            5:31.66Y     1 6     6       6  01      NN41
G03AM          Smittle, Katelyn E          57C1421F9DC4110  50C   29.87 1:02.91 1:36.52 2:10.14 2:43.78 3:17.39 3:51.44 4:25.19 4:58.93 5:31.66F             N33
D03AM  FR  Stebbins, Nathan M          F78D7F67D8C4A   1009200818MM 2001  6 UNOV11072026                            1:48.66Y     1 8     6       6  01      NN51
D3F78D7F67D8C449Nate                                                                                                                                         N01
G03AM          Stebbins, Nathan M          F78D7F67D8C41 4  50C   25.46   52.43 1:20.46 1:48.66                                                F             N68
D03AM  FR  Stebbins, Nathan M          F78D7F67D8C4A   1009200818MM 5001 22 UNOV11072026                            4:51.89Y     1 6     3  3.   3  0100    NN91
G03AM          Stebbins, Nathan M          F78D7F67D8C4110  50C   26.67   56.23 1:25.99 1:55.89 2:25.96 2:55.84 3:24.86 3:54.38 4:23.67 4:51.89F             N33
D03AM  SO  Sun, Victoria               EB306845FE47A   1007200719FF 2001  5 UNOV11072026                            1:58.92Y     1 6     2  4.   2  0100    NN30
D3EB306845FE4748Victoria                                                                                                                                     N52
G03AM          Sun, Victoria               EB306845FE471 4  50C   27.74   57.64 1:28.39 1:58.92                                                F             N37
D03AM  SO  Sun, Victoria               EB306845FE47A   1007200719FF 1001 15 UNOV11072026                              53.67Y     1 4     1  9.   1  0100    NN20
G03AM          Sun, Victoria               EB306845FE471 2  50C   25.92   53.67                                                                F             N85
D03AM  FR  Sunthornrangsri, Yarinda    FC209DEBA497A   0210200818FF 2001  5 UNOV11072026                            1:57.09Y     1 4     1  9.   1  0100    NN84
D3FC209DEBA49746Gene                                                                                                                                         N01
G03AM          Sunthornrangsri, Yarinda    FC209DEBA4971 4  50C   27.26   57.34 1:27.19 1:57.09                                                F             N81
D03AM  FR  Sunthornrangsri, Yarinda    FC209DEBA497A   0210200818FF 5001 21 UNOV11072026                            5:17.41Y     1 4     1  9.   1  0100    NN94
G03AM          Sunthornrangsri, Yarinda    FC209DEBA497110  50C   28.10   59.13 1:30.55 2:02.37 2:34.52 3:06.75 3:39.35 4:12.16 4:45.16 5:17.41F             N26
D03AM  FR  Sunthornrangsri, Yarinda    FC209DEBA497A   0210200818FF 4005 25 UNOV11072026                            4:36.42Y     1 4     1  9.   1  0500    NN94
G03AM          Sunthornrangsri, Yarinda    FC209DEBA4971 8  50C   28.97 1:02.99 1:38.12 2:12.35 2:52.78 3:33.31 4:05.89 4:36.42                F             N05
D03AM  SO  Trinh, Lili A               7C6E772B9686A   0201200719FF 2004 11 UNOV11072026                            2:20.41Y     1 6     6  1.   6  0400    NN69
D37C6E772B968644Lili                                                                                                                                         N80
G03AM          Trinh, Lili A               7C6E772B96861 4  50C   31.65 1:06.70 1:42.88 2:20.41                                                F             N76
D03AM  SO  Trinh, Lili A               7C6E772B9686A   0201200719FF 2002 17 UNOV11072026                            2:18.27Y     1 6     5  1.   5  0200    NN79
G03AM          Trinh, Lili A               7C6E772B96861 4  50C   32.86 1:08.27 1:43.66 2:18.27                                                F             N76
D03AM  SO  Trinh, Lili A               7C6E772B9686A   0201200719FF 4005 25 UNOV11072026                            4:51.40Y     1 6     5  1.   5  0500    NN79
G03AM          Trinh, Lili A               7C6E772B96861 8  50C   31.09 1:06.36 1:43.99 2:22.46 3:03.16 3:45.07 4:18.87 4:51.40                F             N79
D03AM  SO  Tsai, Otis                  555F0A924593A   0925200719MM 1002  8 UNOV11072026                              54.42Y     1 6     4  2.   4  0200    NN88
D3555F0A9245934COtis                                                                                                                                         N90
G03AM          Tsai, Otis                  555F0A9245931 2  50C   26.54   54.42                                                                F             N44
D03AM  SO  Tsai, Otis                  555F0A924593A   0925200719MM 2002 18 UNOV11072026                            2:04.06Y     1 2     7       7  02      NN88
G03AM          Tsai, Otis                  555F0A9245931 4  50C   28.95 1:00.58 1:32.66 2:04.06                                                F             N06
D03AM  SR  Venters, Cole M             FF7DD7F6AEF1A   0910200422MM10001  4 UNOV11072026                           10:02.13Y     1 6     4  2.   4  0100    NN01
D3FF7DD7F6AEF14DCole                                                                                                                                         N31
G03AM          Venters, Cole M             FF7DD7F6AEF1120  50C   27.08   56.75 1:27.13 1:57.87 2:28.14 2:58.76 3:29.12 3:59.43 4:29.89 5:00.56F             N42
G03AM          Venters, Cole M             FF7DD7F6AEF1220  50C 5:30.89 6:01.46 6:32.09 7:02.69 7:33.07 8:03.53 8:33.96 9:04.34 9:33.8010:02.13F             N82
D03AM  SR  Venters, Cole M             FF7DD7F6AEF1A   0910200422MM 5001 22 UNOV11072026                            4:53.48Y     1 2     4  2.   4  0100    NN01
G03AM          Venters, Cole M             FF7DD7F6AEF1110  50C   26.60   55.98 1:25.74 1:55.76 2:25.72 2:55.83 3:25.75 3:55.67 4:25.21 4:53.48F             N32
D03AM  FR  Wang, ZiQiu                 AACAD4E32A06A   0520200818MM 1002  8 UNOV11072026                              50.13Y     1 4     1  9.   1  0200    NN29
D3AACAD4E32A0640ZiQiu                                                                                                                                        N31
G03AM          Wang, ZiQiu                 AACAD4E32A061 2  50C   24.27   50.13                                                                F             N94
D03AM  FR  Wang, ZiQiu                 AACAD4E32A06A   0520200818MM 2002 18 UNOV11072026                            1:52.85Y     1 6     1  9.   1  0200    NN69
G03AM          Wang, ZiQiu                 AACAD4E32A061 4  50C   26.48   54.48 1:23.48 1:52.85                                                F             N46
D03AM  SO  Wangpo, Tenzin M            18D013D5D64DA   0606200719MM 2004 12 UNOV11072026                            1:51.03Y     1 6     1  9.   1  0400    NN01
D318D013D5D64D4BTenzin                                                                                                                                       N81
G03AM          Wangpo, Tenzin M            18D013D5D64D1 4  50C   25.48   54.09 1:22.84 1:51.03                                                F             N87
D03AM  SO  Wangpo, Tenzin M            18D013D5D64DA   0606200719MM 2002 18 UNOV11072026                            1:57.00Y     1 4     4  2.   4  0200    NN01
G03AM          Wangpo, Tenzin M            18D013D5D64D1 4  50C   28.00   57.98 1:27.75 1:57.00                                                F             N87
D03AM  SO  Wangpo, Tenzin M            18D013D5D64DA   0606200719MM 4005 26 UNOV11072026                            4:12.73Y     1 4     4  2.   4  0500    NN11
G03AM          Wangpo, Tenzin M            18D013D5D64D1 8  50C   26.47   56.31 1:28.21 2:00.21 2:36.89 3:13.87 3:44.29 4:12.73                F             N70
D03AM  FR  Wong, Christian J           8C4A918F023FA   1211200718MM 1003 10 UNOV11072026                              57.24Y     1 4     1  9.   1  0300    NN11
D38C4A918F023F44Christian                                                                                                                                    N82
G03AM          Wong, Christian J           8C4A918F023F1 2  50C   26.90   57.24                                                                F             N76
D03AM  FR  Wong, Christian J           8C4A918F023FA   1211200718MM 2003 20 UNOV11072026                            2:10.27Y     1 4     2  4.   2  0300    NN21
G03AM          Wong, Christian J           8C4A918F023F1 4  50C   29.45 1:03.59 1:37.35 2:10.27                                                F             N48
D03AM  SR  Zaniolo, Anna G             51813519EEBFA   0506200521FF 2001  5 UNOV11072026                            2:01.80Y     1 8     5  1.   5  0100    NN30
D351813519EEBF40Anna                                                                                                                                         N80
G03AM          Zaniolo, Anna G             51813519EEBF1 4  50C   28.35   59.33 1:30.41 2:01.80                                                F             N27
D03AM  SR  Zaniolo, Anna G             51813519EEBFA   0506200521FF 1001 15 UNOV11072026                              55.53Y     1 6     4  2.   4  0100    NN20
G03AM          Zaniolo, Anna G             51813519EEBF1 2  50C   26.54   55.53                                                                F             N85
D03AM  SR  Zheng, Jessica              9CB87E423D6AA   1022200521FF10001  3 UNOV11072026                           11:23.11Y     1 6     6  1.   6  0100    NN60
D39CB87E423D6A41Jessica                                                                                                                                      N12
G03AM          Zheng, Jessica              9CB87E423D6A120  50C   31.76 1:05.54 1:39.81 2:14.10 2:48.63 3:23.03 3:57.35 4:31.64 5:06.15 5:40.63F             N12
G03AM          Zheng, Jessica              9CB87E423D6A220  50C 6:14.59 6:48.35 7:22.35 7:56.31 8:30.25 9:04.02 9:37.8410:12.3410:46.4311:23.11F             N72
D03AM  SR  Zheng, Jessica              9CB87E423D6AA   1022200521FF 5001 21 UNOV11072026                            5:39.14Y     1 8     8       8  01      NN40
G03AM          Zheng, Jessica              9CB87E423D6A110  50C   31.28 1:04.59 1:38.18 2:12.33 2:46.74 3:21.13 3:55.78 4:30.41 5:05.03 5:39.14F             N12
E03AM      AAMCMU   F 4007  1 UNOV  011072026                            3:57.64Y     1 4     1 11.                                            1N   0500X    N64
F03AM  FR      AMCMU AChen, Sarah Y               CA09F5D4110B   1226200718F  1             CA09F5D4110B49Sarah                                              N99
G03AM          Chen, Sarah Y               CA09F5D4110B1 8  50C   28.53   58.96                                                                F             N15
F03AM  FR      AMCMU AChen, Ziyu                  E9C81A13B32C   0718200818F  2             E9C81A13B32C49Zoe                                                N88
G03AM          Chen, Ziyu                  E9C81A13B32C1 8  50C 1:30.15 2:05.95                                                                F             N05
F03AM  SO      AMCMU AGil, Audrey L               6055FC4F0DA4   0911200719F  3             6055FC4F0DA44FAudrey                                             N60
G03AM          Gil, Audrey L               6055FC4F0DA41 8  50C 2:31.92 3:03.11                                                                F             N55
F03AM  SR      AMCMU AZaniolo, Anna G             51813519EEBF   0506200521F  4             51813519EEBF40Anna                                               N20
G03AM          Zaniolo, Anna G             51813519EEBF1 8  50C 3:28.78 3:57.64                                                                F             N46
E03AM      BAMCMU   F 4007  1 UNOV  011072026                            4:07.33Y     1 6     5                                                5N   05  X    N24
F03AM  SO      AMCMU BTrinh, Lili A               7C6E772B9686   0201200719F  1             7C6E772B968644Lili                                               N59
G03AM          Trinh, Lili A               7C6E772B96861 8  50C   29.41 1:01.91                                                                F             N25
F03AM  SO      AMCMU BSun, Victoria               EB306845FE47   1007200719F  2             EB306845FE4748Victoria                                           N02
G03AM          Sun, Victoria               EB306845FE471 8  50C 1:33.96 2:10.43                                                                F             N26
F03AM  SO      AMCMU BDoan, Tran B                1D8D1F9CA823   1024200719F  3             1D8D1F9CA8234ATran                                               N49
G03AM          Doan, Tran B                1D8D1F9CA8231 8  50C 2:38.68 3:12.14                                                                F             N15
F03AM          AMCMU BDhansura, Alefiya                                  19F  4                                                                              N55
G03AM          Dhansura, Alefiya                       1 8  50C 3:38.20 4:07.33                                                                F             N95
E03AM      CAMCMU   F 4007  1 UNOV  011072026                            4:10.38Y     1 2     6                                                6N   05  X    N24
F03AM  FR      AMCMU CFlanagan, Annie             6C8F2D47CECC   1022200719F  1             6C8F2D47CECC46Annie                                              N51
G03AM          Flanagan, Annie             6C8F2D47CECC1 8  50C   31.04 1:04.35                                                                F             N66
F03AM  SR      AMCMU CShaffer, Elizabeth L        55398D6F685D   0712200521F  2             55398D6F685D4FElizabeth                                          N24
G03AM          Shaffer, Elizabeth L        55398D6F685D1 8  50C 1:36.16 2:12.74                                                                F             N18
F03AM  SO      AMCMU CSierzanowski, Natalie J     C6F3DD033018   0310200719F  3             C6F3DD0330184CNatalie                                            N74
G03AM          Sierzanowski, Natalie J     C6F3DD0330181 8  50C 2:41.43 3:14.04                                                                F             N49
F03AM  SO      AMCMU CMuncy, Madeline J           016D42289322   1007200719F  4             016D4228932243Maddie                                             N21
G03AM          Muncy, Madeline J           016D422893221 8  50C 3:40.21 4:10.38                                                                F             N76
E03AM      DAMCMU   F 4007  1 UNOV  011072026                            4:14.26Y     1 8     7                                                7N   05  X    N24
F03AM  JR      AMCMU DKim, Allie Y                C11CE1E59D41   0718200620F  1             C11CE1E59D4149Allie                                              N59
G03AM          Kim, Allie Y                C11CE1E59D411 8  50C   30.12 1:02.42                                                                F             N84
F03AM  FR      AMCMU DLee, Cherry                 4296C8206084   1220200718F  2             4296C820608440Cherry                                             N69
G03AM          Lee, Cherry                 4296C82060841 8  50C 1:35.60 2:13.95                                                                F             N05
F03AM  SO      AMCMU DGregory, Julia A            42B52091CC66   0411200719F  3             42B52091CC664AJulia                                              N01
G03AM          Gregory, Julia A            42B52091CC661 8  50C 2:43.09 3:17.87                                                                F             N66
F03AM  JR      AMCMU DRosenberg, Elizabeth S      944B02EDF253   1212200520F  4             944B02EDF25348Lizzy                                              N63
G03AM          Rosenberg, Elizabeth S      944B02EDF2531 8  50C 3:43.57 4:14.26                                                                F             N09
E03AM      AAMCMU   M 4007  2 UNOV  011072026                            3:23.51Y     1 4     1 11.                                            1N   0500X    N64
F03AM  SR      AMCMU AMorford, Brayden S          0BDCB954833B   1115200421M  1             0BDCB954833B48Brayden                                            N92
G03AM          Morford, Brayden S          0BDCB954833B1 8  50C   23.48   49.13                                                                F             N17
F03AM  FR      AMCMU ALiu, Matthew J              42E096107EAB   0121200818M  2             42E096107EAB48Matthew                                            N21
G03AM          Liu, Matthew J              42E096107EAB1 8  50C 1:16.03 1:46.55                                                                F             N95
F03AM  FR      AMCMU AChung, Jimin                F8528C9DB494   1224200718M  3             F8528C9DB4944BJimin                                              N30
G03AM          Chung, Jimin                F8528C9DB4941 8  50C 2:10.39 2:37.14                                                                F             N75
F03AM  FR      AMCMU AGossmann, Roberto           9535A0AC3F9B   0617200719M  4             9535A0AC3F9B4CRoberto                                            N43
G03AM          Gossmann, Roberto           9535A0AC3F9B1 8  50C 2:59.12 3:23.51                                                                F             N87
E03AM      BAMCMU   M 4007  2 UNOV  011072026                            3:28.53Y     1 6     3  2.                                            3N   0500X    N64
F03AM  SO      AMCMU BWangpo, Tenzin M            18D013D5D64D   0606200719M  1             18D013D5D64D4BTenzin                                             N91
G03AM          Wangpo, Tenzin M            18D013D5D64D1 8  50C   25.94   53.21                                                                F             N46
F03AM  FR      AMCMU BWong, Christian J           8C4A918F023F   1211200718M  2             8C4A918F023F44Christian                                          N23
G03AM          Wong, Christian J           8C4A918F023F1 8  50C 1:19.45 1:49.86                                                                F             N27
F03AM  SR      AMCMU BLathrop, Austin             205585D07FA0   0929200521M  3             205585D07FA040Austin                                             N81
G03AM          Lathrop, Austin             205585D07FA01 8  50C 2:13.26 2:41.09                                                                F             N96
F03AM  SO      AMCMU BGu, Zhehan                  1175C4EB2E7D   0511200719M  4             1175C4EB2E7D4CMax                                                N88
G03AM          Gu, Zhehan                  1175C4EB2E7D1 8  50C 3:03.55 3:28.53                                                                F             N94
E03AM      CAMCMU   M 4007  2 UNOV  011072026                            3:29.87Y     1 2     4                                                4N   05  X    N34
F03AM  SO      AMCMU CTsai, Otis                  555F0A924593   0925200719M  1             555F0A9245934COtis                                               N09
G03AM          Tsai, Otis                  555F0A9245931 8  50C   26.63   54.73                                                                F             N44
F03AM  SO      AMCMU CQuach, Harrison T           B8B38F219104   1004200521M  2             B8B38F2191044BHarrison                                           N72
G03AM          Quach, Harrison T           B8B38F2191041 8  50C 1:21.56 1:52.58                                                                F             N17
F03AM  FR      AMCMU CKueh, Michael               9835351D2C34   0124200818M  3             9835351D2C3448Michael                                            N70
G03AM          Kueh, Michael               9835351D2C341 8  50C 2:16.52 2:44.43                                                                F             N75
F03AM  FR      AMCMU CPeitler, Matthew            6ACE1074C0B6   0813200620M  4             6ACE1074C0B644Matt                                               N51
G03AM          Peitler, Matthew            6ACE1074C0B61 8  50C 3:05.55 3:29.87                                                                F             N47
E03AM      DAMCMU   M 4007  2 UNOV  011072026                            3:41.13Y     1 8     7                                                7N   05  X    N24
F03AM  FR      AMCMU DDe Fabrique, Paolo          77606738F69C   1022200719M  1             77606738F69C46Paolo                                              N71
G03AM          De Fabrique, Paolo          77606738F69C1 8  50C   27.88   56.97                                                                F             N96
F03AM  FR      AMCMU DSchmid, Aaron Z             1F29228D3A76   0401200818M  2             1F29228D3A7648Aaron                                              N50
G03AM          Schmid, Aaron Z             1F29228D3A761 8  50C 1:25.25 1:58.03                                                                F             N26
F03AM  FR      AMCMU DStebbins, Nathan M          F78D7F67D8C4   1009200818M  3             F78D7F67D8C449Nate                                               N91
G03AM          Stebbins, Nathan M          F78D7F67D8C41 8  50C 2:22.58 2:52.40                                                                F             N67
F03AM  SO      AMCMU DChen, Andrew                CA5865516725   1030200620M  4             CA58655167254EAndrew                                             N20
G03AM          Chen, Andrew                CA58655167251 8  50C 3:15.68 3:41.13                                                                F             N45
E03AM      AAMCMU   F 2006 27 UNOV  011072026                            1:38.32Y     1 4     1 11.                                            1N   0100X    N64
F03AM  SO      AMCMU AGil, Audrey L               6055FC4F0DA4   0911200719F  1             6055FC4F0DA44FAudrey                                             N60
G03AM          Gil, Audrey L               6055FC4F0DA41 4  50C   24.75                                                                        F             N64
F03AM  SO      AMCMU ASun, Victoria               EB306845FE47   1007200719F  2             EB306845FE4748Victoria                                           N02
G03AM          Sun, Victoria               EB306845FE471 4  50C   49.66                                                                        F             N35
F03AM  FR      AMCMU AChen, Sarah Y               CA09F5D4110B   1226200718F  3             CA09F5D4110B49Sarah                                              N99
G03AM          Chen, Sarah Y               CA09F5D4110B1 4  50C 1:13.89                                                                        F             N74
F03AM  SR      AMCMU AZaniolo, Anna G             51813519EEBF   0506200521F  4             51813519EEBF40Anna                                               N20
G03AM          Zaniolo, Anna G             51813519EEBF1 4  50C 1:38.32                                                                        F             N55
E03AM      BAMCMU   F 2006 27 UNOV  011072026                            1:39.84Y     1 6     3  2.                                            3N   0100X    N64
F03AM  JR      AMCMU BKim, Allie Y                C11CE1E59D41   0718200620F  1             C11CE1E59D4149Allie                                              N59
G03AM          Kim, Allie Y                C11CE1E59D411 4  50C   25.51                                                                        F             N14
F03AM  JR      AMCMU BRosenberg, Elizabeth S      944B02EDF253   1212200520F  2             944B02EDF25348Lizzy                                              N63
G03AM          Rosenberg, Elizabeth S      944B02EDF2531 4  50C   50.44                                                                        F             N08
F03AM  SO      AMCMU BMuncy, Madeline J           016D42289322   1007200719F  3             016D4228932243Maddie                                             N21
G03AM          Muncy, Madeline J           016D422893221 4  50C 1:15.11                                                                        F             N06
F03AM  JR      AMCMU BLu, Janna Antoinette        839AF8FC2FD4   1016200620F  4             839AF8FC2FD444Janna                                              N13
G03AM          Lu, Janna Antoinette        839AF8FC2FD41 4  50C 1:39.84                                                                        F             N87
E03AM      CAMCMU   F 2006 27 UNOV  011072026                            1:41.11Y     1 2     4                                                4N   01  X    N24
F03AM  SO      AMCMU CDoan, Tran B                1D8D1F9CA823   1024200719F  1             1D8D1F9CA8234ATran                                               N49
G03AM          Doan, Tran B                1D8D1F9CA8231 4  50C   25.38                                                                        F             N24
F03AM  SO      AMCMU CGregory, Julia A            42B52091CC66   0411200719F  2             42B52091CC664AJulia                                              N01
G03AM          Gregory, Julia A            42B52091CC661 4  50C   51.89                                                                        F             N65
F03AM          AMCMU CDhansura, Alefiya                                  19F  3                                                                              N55
G03AM          Dhansura, Alefiya                       1 4  50C 1:16.76                                                                        F             N25
F03AM  FR      AMCMU CChen, Ziyu                  E9C81A13B32C   0718200818F  4             E9C81A13B32C49Zoe                                                N88
G03AM          Chen, Ziyu                  E9C81A13B32C1 4  50C 1:41.11                                                                        F             N24
E03AM      DAMCMU   F 2006 27 UNOV  011072026                            1:44.60Y     1 8     6                                                6N   01  X    N34
F03AM  FR      AMCMU DFlanagan, Annie             6C8F2D47CECC   1022200719F  1             6C8F2D47CECC46Annie                                              N51
G03AM          Flanagan, Annie             6C8F2D47CECC1 4  50C   26.00                                                                        F             N95
F03AM  SR      AMCMU DShaffer, Elizabeth L        55398D6F685D   0712200521F  2             55398D6F685D4FElizabeth                                          N24
G03AM          Shaffer, Elizabeth L        55398D6F685D1 4  50C   51.98                                                                        F             N27
F03AM  SO      AMCMU DSierzanowski, Natalie J     C6F3DD033018   0310200719F  3             C6F3DD0330184CNatalie                                            N74
G03AM          Sierzanowski, Natalie J     C6F3DD0330181 4  50C 1:18.27                                                                        F             N88
F03AM  SO      AMCMU DSmittle, Katelyn E          57C1421F9DC4   1222200619F  4             57C1421F9DC445Katelyn                                            N92
G03AM          Smittle, Katelyn E          57C1421F9DC41 4  50C 1:44.60                                                                        F             N86
E03AM      AAMCMU   M 2006 28 UNOV  011072026                            1:23.12Y     1 4     1 11.                                            1N   0100X    N64
F03AM  SR      AMCMU AMorford, Brayden S          0BDCB954833B   1115200421M  1             0BDCB954833B48Brayden                                            N92
G03AM          Morford, Brayden S          0BDCB954833B1 4  50C   20.79                                                                        F             N66
F03AM  FR      AMCMU AWang, ZiQiu                 AACAD4E32A06   0520200818M  2             AACAD4E32A0640ZiQiu                                              N99
G03AM          Wang, ZiQiu                 AACAD4E32A061 4  50C   41.84                                                                        F             N44
F03AM  FR      AMCMU AHunter, Brock S             F8AC4D07901D   1124200718M  3             F8AC4D07901DAABrock                                              N11
G03AM          Hunter, Brock S             F8AC4D07901D1 4  50C 1:02.74                                                                        F             N75
F03AM  FR      AMCMU APeitler, Matthew            6ACE1074C0B6   0813200620M  4             6ACE1074C0B644Matt                                               N51
G03AM          Peitler, Matthew            6ACE1074C0B61 4  50C 1:23.12                                                                        F             N66
E03AM      BAMCMU   M 2006 28 UNOV  011072026                            1:27.92Y     1 6     4                                                4N   01  X    N34
F03AM  SO      AMCMU BQuach, Harrison T           B8B38F219104   1004200521M  1             B8B38F2191044BHarrison                                           N72
G03AM          Quach, Harrison T           B8B38F2191041 4  50C   22.17                                                                        F             N16
F03AM  FR      AMCMU BGossmann, Roberto           9535A0AC3F9B   0617200719M  2             9535A0AC3F9B4CRoberto                                            N43
G03AM          Gossmann, Roberto           9535A0AC3F9B1 4  50C   44.16                                                                        F             N96
F03AM  SR      AMCMU BQuan, Jacob M               DA82DCDEBB66   1119200421M  3             DA82DCDEBB6640Jacob                                              N40
G03AM          Quan, Jacob M               DA82DCDEBB661 4  50C 1:06.37                                                                        F             N05
F03AM  SO      AMCMU BTsai, Otis                  555F0A924593   0925200719M  4             555F0A9245934COtis                                               N09
G03AM          Tsai, Otis                  555F0A9245931 4  50C 1:27.92                                                                        F             N14
E03AM      CAMCMU   M 2006 28 UNOV  011072026                            1:29.81Y     1 2     5                                                5N   01  X    N34
F03AM  FR      AMCMU CDe Fabrique, Paolo          77606738F69C   1022200719M  1             77606738F69C46Paolo                                              N71
G03AM          De Fabrique, Paolo          77606738F69C1 4  50C   24.77                                                                        F             N36
F03AM  SO      AMCMU CLuebke, Alexandre W         94C13BB285E8   0808200719M  2             94C13BB285E849Alex                                               N02
G03AM          Luebke, Alexandre W         94C13BB285E81 4  50C   45.17                                                                        F             N86
F03AM  SR      AMCMU CVenters, Cole M             FF7DD7F6AEF1   0910200422M  3             FF7DD7F6AEF14DCole                                               N31
G03AM          Venters, Cole M             FF7DD7F6AEF11 4  50C 1:07.60                                                                        F             N06
F03AM  SO      AMCMU CChen, Andrew                CA5865516725   1030200620M  4             CA58655167254EAndrew                                             N20
G03AM          Chen, Andrew                CA58655167251 4  50C 1:29.81                                                                        F             N74
E03AM      DAMCMU   M 2006 28 UNOV  011072026                            1:31.29Y     1 8     8                                                8N   01  X    N44
F03AM  SR      AMCMU DLathrop, Austin             205585D07FA0   0929200521M  1             205585D07FA040Austin                                             N81
G03AM          Lathrop, Austin             205585D07FA01 4  50C   22.97                                                                        F             N95
F03AM  FR      AMCMU DKueh, Michael               9835351D2C34   0124200818M  2             9835351D2C3448Michael                                            N70
G03AM          Kueh, Michael               9835351D2C341 4  50C   45.23                                                                        F             N84
F03AM  SR      AMCMU DHaraldsson, Miles T         317FF48C016B   1101200422M  3             317FF48C016B4DMiles                                              N42
G03AM          Haraldsson, Miles T         317FF48C016B1 4  50C   1:08.82                                                                        F             N27
F03AM  FR      AMCMU DStebbins, Nathan M          F78D7F67D8C4   1009200818M  4             F78D7F67D8C449Nate                                               N91
G03AM          Stebbins, Nathan M          F78D7F67D8C41 4  50C 1:31.29                                                                        F             N96
C13MA      MAGETTGettysburg College            Gettysburg      Greg Brown            300 N Washington St   Gettysburg          PA17325     USA               N93
D03MA  SR  Berry, Ava                              A   1230200418FF10001  3 UNOV11072026                           10:43.55Y     1 5     1  9.   1  0100    NN57
D3                                                                                                                                                           N67
G03MA          Berry, Ava                              120  50C   28.93 1:00.36 1:32.36 2:04.44 2:36.83 3:09.20 3:41.73 4:14.28 4:46.73 5:19.09F             N98
G03MA          Berry, Ava                              220  50C 5:51.62 6:24.32 6:57.17 7:30.00 8:02.61 8:35.36 9:07.89 9:40.4610:12.4610:43.55F             N49
D03MA  SR  Berry, Ava                              A   1230200418FF 4005 25 UNOV11072026                            4:38.20Y     1 5     2  4.   2  0500    NN47
G03MA          Berry, Ava                              1 8  50C   29.95 1:04.10 1:39.83 2:15.11 2:56.24 3:36.84 4:07.77 4:38.20                F             N47
D03MA  SR  Booth, Connor                           A   0319200518MM 1003 10 UNOV11072026                            1:03.66Y     1 1     7       7  03      NN48
D3                                                                                                                                                           N67
G03MA          Booth, Connor                           1 2  50C   29.70 1:03.66                                                                F             N34
D03MA  SR  Booth, Connor                           A   0319200518MM 1001 16 UNOV11072026                              50.26Y     1 1     8       8  01      NN28
G03MA          Booth, Connor                           1 2  50C   24.23   50.26                                                                F             N04
D03MA  SO  Booth, Kellen                           A   0328200718MM 2001  6 UNOV11072026                            1:48.91Y     1 3     7       7  01      NN38
D3                                                                                                                                                           N67
G03MA          Booth, Kellen                           1 4  50C   25.18   52.67 1:20.99 1:48.91                                                F             N55
D03MA  SO  Booth, Kellen                           A   0328200718MM 5001 22 UNOV11072026                            5:01.41Y     1 3     6  1.   6  0100    NN68
G03MA          Booth, Kellen                           110  50C   26.34   55.18 1:25.39 1:56.04 2:26.78 2:57.87 3:29.18 4:00.44 4:31.87 5:01.41F             N99
D03MA  SO  Brown, Emily                            A   0504200718FF10001  3 UNOV11072026                           11:17.24Y     1 1     4       4  01      NN08
D3                                                                                                                                                           N67
G03MA          Brown, Emily                            120  50C   30.08 1:02.58 1:35.69 2:09.24 2:43.10 3:16.65 3:50.45 4:24.35 4:58.49 5:32.88F             N99
G03MA          Brown, Emily                            220  50C 6:07.17 6:42.15 7:16.53 7:51.21 8:25.86 9:00.65 9:34.8210:09.4410:43.5311:17.24F             N40
D03MA  SO  Brown, Emily                            A   0504200718FF 5001 21 UNOV11072026                            5:36.04Y     1 1     7       7  01      NN08
G03MA          Brown, Emily                            110  50C   29.87 1:02.09 1:35.68 2:09.72 2:43.98 3:18.46 3:52.99 4:28.70 5:02.88 5:36.04F             N00
D03MA      Burek, Ryan                             A           FRMM  501 14 UNOV11072026                              21.94Y     1 5     6       6  01      NN36
D3                                                                                                                                                           N67
D03MA      Burek, Ryan                             A           FRMM 1004 24 UNOV11072026                              51.54Y     1 5     2  4.   2  0400    NN76
G03MA          Burek, Ryan                             1 2  50C   23.85   51.54                                                                F             N23
D03MA  SO  Butterfield, Benjamin                   A   1012200618MM 2004 12 UNOV11072026                            1:59.15Y     1 5     4  2.   4  0400    NN71
D3              Ben                                                                                                                                          N68
G03MA          Butterfield, Benjamin                   1 4  50C   25.79   55.73 1:27.02 1:59.15                                                F             N58
D03MA  SO  Butterfield, Benjamin                   A   1012200618MM 1004 24 UNOV11072026                              52.74Y     1 3     4  2.   4  0400    NN51
G03MA          Butterfield, Benjamin                   1 2  50C   24.40   52.74                                                                F             N07
D03MA  SO  Campet, Benjamin                        A   0128200718MM 1003 10 UNOV11072026                            1:00.36Y     1 5     4  2.   4  0300    NN69
D3              Ben                                                                                                                                          N68
G03MA          Campet, Benjamin                        1 2  50C   28.45 1:00.36                                                                F             N25
D03MA  SO  Campet, Benjamin                        A   0128200718MM 4005 26 UNOV11072026                            4:25.60Y     1 7     6       6  05      NN59
G03MA          Campet, Benjamin                        1 8  50C   28.29   59.64 1:34.17 2:08.94 2:46.34 3:24.79 3:55.71 4:25.60                F             N59
D03MA  SR  Csokmay, Audrey                         A   1007200418FF 1003  9 UNOV11072026                            1:10.21Y     1 3     5  1.   5  0300    NN39
D3                                                                                                                                                           N67
G03MA          Csokmay, Audrey                         1 2  50C   33.01 1:10.21                                                                F             N94
D03MA  SR  Csokmay, Audrey                         A   1007200418FF 2002 17 UNOV11072026                            2:20.35Y     1 7     7       7  02      NN29
G03MA          Csokmay, Audrey                         1 4  50C   32.54 1:08.13 1:44.23 2:20.35                                                F             N46
D03MA      Dolan, Reilly                           A           FRFF 1003  9 UNOV11072026                            1:08.29Y     1 5     3  3.   3  0300    NN57
D3                                                                                                                                                           N67
G03MA          Dolan, Reilly                           1 2  50C   32.81 1:08.29                                                                F             N24
D03MA      Dolan, Reilly                           A           FRFF 2003 19 UNOV11072026                            2:27.64Y     1 5     1  9.   1  0300    NN67
G03MA          Dolan, Reilly                           1 4  50C   34.04 1:11.43 1:49.76 2:27.64                                                F             N75
D03MA      Duprey, Caitrin                         A           FRFF 2004 11 UNOV11072026                            2:08.00Y     1 3     1  9.   1  0400    NN48
D3                                                                                                                                                           N67
G03MA          Duprey, Caitrin                         1 4  50C   29.80 1:03.07 1:35.99 2:08.00                                                F             N56
D03MA      Duprey, Caitrin                         A           FRFF 1004 23 UNOV11072026                              57.65Y     1 3     2  4.   2  0400    NN28
G03MA          Duprey, Caitrin                         1 2  50C   27.62   57.65                                                                F             N94
D03MA  SR  Floren Smith, Erik                      A   1109200418MM 2001  6 UNOV11072026                            1:52.77Y     1 1     8       8  01      NN89
D3                                                                                                                                                           N67
G03MA          Floren Smith, Erik                      1 4  50C   25.67   54.63 1:23.77 1:52.77                                                F             N07
D03MA  SR  Floren Smith, Erik                      A   1109200418MM  501 14 UNOV11072026                              23.27Y     1 1     8       8  01      NN59
D03MA      Galef, Will                             A           FRMM 2002 18 UNOV11072026                            2:02.00Y     1 7     5  1.   5  0200    NN76
D3                                                                                                                                                           N67
G03MA          Galef, Will                             1 4  50C   28.71   59.90 1:31.22 2:02.00                                                F             N54
D03MA  JR  Graham, Evan                            A   0307200617MM 1002  8 UNOV11072026                              51.11Y     1 5     2  4.   2  0200    NN87
D3                                                                                                                                                           N67
G03MA          Graham, Evan                            1 2  50C   25.23   51.11                                                                F             N43
D03MA  JR  Graham, Evan                            A   0307200617MM 4005 26 UNOV11072026                            4:12.04Y     1 5     3  3.   3  0500    NN18
G03MA          Graham, Evan                            1 8  50C   26.28   55.88 1:28.44 2:00.24 2:36.57 3:13.69 3:43.55 4:12.04                F             N97
D03MA  SO  Hall, Kaitlin                           A   0923200718FF 2001  5 UNOV11072026                            1:59.08Y     1 3     3  3.   3  0100    NN58
D3              Kait                                                                                                                                         N09
G03MA          Hall, Kaitlin                           1 4  50C   27.75   57.73 1:28.31 1:59.08                                                F             N45
D03MA  SO  Hall, Kaitlin                           A   0923200718FF 2003 19 UNOV11072026                            2:35.97Y     1 3     6       6  03      NN38
G03MA          Hall, Kaitlin                           1 4  50C   35.00 1:14.15 1:54.42 2:35.97                                                F             N55
D03MA      Hersey, Grayson                         A           FRMM 1002  8 UNOV11072026                              57.34Y     1 1     8       8  02      NN08
D3                                                                                                                                                           N67
G03MA          Hersey, Grayson                         1 2  50C   27.17   57.34                                                                F             N94
D03MA  SO  Hottle, Davis                           A   0425200718MM10001  4 UNOV11072026                           10:21.50Y     1 3     6       6  01      NN48
D3                                                                                                                                                           N67
G03MA          Hottle, Davis                           120  50C   26.52   56.60 1:27.60 1:58.52 2:29.55 3:00.82 3:32.07 4:03.59 4:34.99 5:07.09F             N00
G03MA          Hottle, Davis                           220  50C 5:38.33 6:09.73 6:41.82 7:13.44 7:45.31 8:16.85 8:48.86 9:20.38 9:51.5110:21.50F             N70
D03MA      Jefferson, McKinley                     A           FRFF 1002  7 UNOV11072026                            1:03.11Y     1 3     5  1.   5  0200    NN69
D3                                                                                                                                                           N67
G03MA          Jefferson, McKinley                     1 2  50C   29.86 1:03.11                                                                F             N46
D03MA      Jefferson, McKinley                     A           FRFF 2002 17 UNOV11072026                            2:14.03Y     1 5     3  3.   3  0200    NN79
G03MA          Jefferson, McKinley                     1 4  50C   31.35 1:05.11 1:39.76 2:14.03                                                F             N87
D03MA      Kennedy, Kaileigh                       A           FRFF10001  3 UNOV11072026                           11:04.92Y     1 3     2  4.   2  0100    NN09
D3                                                                                                                                                           N67
G03MA          Kennedy, Kaileigh                       120  50C   28.84 1:00.90 1:33.51 2:06.41 2:39.84 3:13.13 3:46.47 4:19.88 4:54.05 5:27.27F             N61
G03MA          Kennedy, Kaileigh                       220  50C 6:00.83 6:34.50 7:08.48 7:42.39 8:16.33 8:50.10 9:23.95 9:57.9310:31.7311:04.92F             N12
D03MA      Kennedy, Kaileigh                       A           FRFF 5001 21 UNOV11072026                            5:24.28Y     1 3     2  4.   2  0100    NN09
G03MA          Kennedy, Kaileigh                       110  50C   28.30   59.83 1:31.83 2:04.40 2:37.43 3:10.95 3:44.14 4:17.76 4:51.49 5:24.28F             N31
D03MA  SR  Kim, Edward                             A   0822200518MM  501 14 UNOV11072026                              21.91Y     1 7     5  1.   5  0100    NN57
D3                                                                                                                                                           N67
D03MA  SR  Kim, Edward                             A   0822200518MM 2002 18 UNOV11072026                            1:56.67Y     1 3     3  3.   3  0200    NN97
G03MA          Kim, Edward                             1 4  50C   27.58   56.82 1:26.73 1:56.67                                                F             N74
D03MA      Kiss, Kinga                             A           FRFF 2004 11 UNOV11072026                            2:18.11Y     1 1     4       4  04      NN46
D3                                                                                                                                                           N67
G03MA          Kiss, Kinga                             1 4  50C   30.61 1:05.30 1:41.52 2:18.11                                                F             N74
D03MA      Kiss, Kinga                             A           FRFF 4005 25 UNOV11072026                            4:53.24Y     1 3     6       6  05      NN56
G03MA          Kiss, Kinga                             1 8  50C   30.26 1:05.63 1:44.57 2:23.25 3:05.42 3:48.62 4:21.29 4:53.24                F             N77
D03MA  JR  Mangan, Connor                          A   0524200617MM 1002  8 UNOV11072026                              53.10Y     1 3     3  3.   3  0200    NN68
D3                                                                                                                                                           N67
G03MA          Mangan, Connor                          1 2  50C   26.06   53.10                                                                F             N34
D03MA  JR  Mangan, Connor                          A   0524200617MM 2002 18 UNOV11072026                            1:55.38Y     1 5     2  4.   2  0200    NN09
G03MA          Mangan, Connor                          1 4  50C   27.92   57.22 1:26.46 1:55.38                                                F             N85
D03MA  SR  Martin, Cole                            A   0404200518MM  501 14 UNOV11072026                              21.72Y     1 3     4  2.   4  0100    NN97
D3                                                                                                                                                           N67
D03MA  SR  Martin, Cole                            A   0404200518MM 1001 16 UNOV11072026                              49.74Y     1 7     7       7  01      NN87
G03MA          Martin, Cole                            1 2  50C   23.38   49.74                                                                F             N63
D03MA  SR  McKenzie, Delanie                       A   0304200518FF 1002  7 UNOV11072026                              58.90Y     1 5     2  4.   2  0200    NN59
D3              Lanie                                                                                                                                        N39
G03MA          McKenzie, Delanie                       1 2  50C   28.89   58.90                                                                F             N35
D03MA  SR  McKenzie, Delanie                       A   0304200518FF 1001 15 UNOV11072026                              54.26Y     1 5     3  3.   3  0100    NN69
G03MA          McKenzie, Delanie                       1 2  50C   26.26   54.26                                                                F             N25
D03MA  SR  McKim, Paige                            A   0907200419FF 2001  5 UNOV11072026                            2:05.53Y     1 1     8       8  01      NN57
D3                                                                                                                                                           N67
G03MA          McKim, Paige                            1 4  50C   29.34 1:00.59 1:32.87 2:05.53                                                F             N05
D03MA  SR  McKim, Paige                            A   0907200419FF 5001 21 UNOV11072026                            5:30.35Y     1 5     4  2.   4  0100    NN97
G03MA          McKim, Paige                            110  50C   30.30 1:02.88 1:36.04 2:09.32 2:42.44 3:15.85 3:49.64 4:23.73 4:57.29 5:30.35F             N49
D03MA  SO  Miller, Kathleen                        A   0129200718FF  501 13 UNOV11072026                              24.92Y     1 7     3  3.   3  0100    NN49
D3              Kate                                                                                                                                         N09
D03MA  SO  Miller, Kathleen                        A   0129200718FF 2003 19 UNOV11072026                            2:32.89Y     1 1     5  1.   5  0300    NN89
G03MA          Miller, Kathleen                        1 4  50C   33.64 1:12.59 1:52.74 2:32.89                                                F             N86
D03MA  SO  Minakas, Maia                           A   0430200718FF 2001  5 UNOV11072026                            2:03.93Y     1 7     7       7  01      NN08
D3                                                                                                                                                           N67
G03MA          Minakas, Maia                           1 4  50C   28.58   59.81 1:31.71 2:03.93                                                F             N35
D03MA  SO  Minakas, Maia                           A   0430200718FF 4005 25 UNOV11072026                            4:50.50Y     1 7     4  2.   4  0500    NN58
G03MA          Minakas, Maia                           1 8  50C   31.86 1:07.16 1:45.81 2:23.29 3:04.04 3:45.26 4:18.70 4:50.50                F             N48
D03MA      Nagle, Audrey                           A           FRFF 1003  9 UNOV11072026                            1:14.43Y     1 7     7       7  03      NN17
D3                                                                                                                                                           N67
G03MA          Nagle, Audrey                           1 2  50C   34.52 1:14.43                                                                F             N14
D03MA      Nagle, Audrey                           A           FRFF 2003 19 UNOV11072026                            2:39.90Y     1 7     7       7  03      NN37
G03MA          Nagle, Audrey                           1 4  50C   35.95 1:16.97 1:58.26 2:39.90                                                F             N75
D03MA  SR  Nelson, Samuel                          A   0314200518MM10001  4 UNOV11072026                            9:46.76Y     1 5     1  9.   1  0100    NN29
D3              Sam                                                                                                                                          N68
G03MA          Nelson, Samuel                          120  50C   25.19   53.34 1:22.55 1:52.17 2:21.90 2:51.76 3:21.34 3:51.09 4:21.60 4:51.45F             N30
G03MA          Nelson, Samuel                          220  50C 5:21.20 5:51.24 6:21.40 6:51.23 7:21.07 7:50.88 8:20.38 8:49.95 9:18.78 9:46.76F             N01
D03MA  SR  Nelson, Samuel                          A   0314200518MM 5001 22 UNOV11072026                            4:43.69Y     1 5     1  9.   1  0100    NN29
G03MA          Nelson, Samuel                          110  50C   25.11   52.88 1:21.63 1:50.87 2:20.30 2:49.81 3:19.07 3:48.02 4:17.08 4:43.69F             N30
D03MA      Peitler, Maya                           A           FRFF 1002  7 UNOV11072026                            1:04.34Y     1 7     6       6  02      NN27
D3                                                                                                                                                           N67
G03MA          Peitler, Maya                           1 2  50C   31.42 1:04.34                                                                F             N14
D03MA      Peitler, Maya                           A           FRFF 2002 17 UNOV11072026                            2:17.76Y     1 3     4  2.   4  0200    NN67
G03MA          Peitler, Maya                           1 4  50C   32.67 1:07.84 1:43.19 2:17.76                                                F             N75
D03MA  SO  Puckett, Morgan                         A   1118200717FF  501 13 UNOV11072026                              25.16Y     1 5     4  2.   4  0100    NN29
D3                                                                                                                                                           N67
D03MA  SO  Puckett, Morgan                         A   1118200717FF 1004 23 UNOV11072026                            1:00.07Y     1 5     5  1.   5  0400    NN59
G03MA          Puckett, Morgan                         1 2  50C   27.36 1:00.07                                                                F             N05
D03MA  JR  Racicot, Kristen                        A   0817200617FF 2004 11 UNOV11072026                            2:11.50Y     1 7     3  3.   3  0400    NN89
D3                                                                                                                                                           N67
G03MA          Racicot, Kristen                        1 4  50C   29.41 1:02.53 1:36.83 2:11.50                                                F             N86
D03MA  JR  Racicot, Kristen                        A   0817200617FF 1004 23 UNOV11072026                            1:00.40Y     1 1     6       6  04      NN49
G03MA          Racicot, Kristen                        1 2  50C   28.28 1:00.40                                                                F             N45
D03MA      Rager, Julian                           A           FRMM10001  4 UNOV11072026                           10:19.14Y     1 7     5  1.   5  0100    NN77
D3                                                                                                                                                           N67
G03MA          Rager, Julian                           120  50C   27.37   57.08 1:27.63 1:58.32 2:29.10 3:00.47 3:31.41 4:02.71 4:34.00 5:05.36F             N79
G03MA          Rager, Julian                           220  50C 5:36.70 6:08.27 6:39.84 7:11.52 7:43.18 8:14.71 8:46.36 9:17.49 9:48.5110:19.14F             N70
D03MA      Rager, Julian                           A           FRMM 4005 26 UNOV11072026                            4:22.36Y     1 3     5  1.   5  0500    NN67
G03MA          Rager, Julian                           1 8  50C   27.34   57.94 1:31.86 2:04.52 2:43.72 3:23.00 3:53.30 4:22.36                F             N38
D03MA  SR  Reck, Delaney                           A   0401200518FF 1001 15 UNOV11072026                              54.24Y     1 3     2  4.   2  0100    NN28
D3                                                                                                                                                           N67
G03MA          Reck, Delaney                           1 2  50C   26.30   54.24                                                                F             N83
D03MA  SR  Reck, Delaney                           A   0401200518FF  501 13 UNOV11072026                              24.62Y     1 3     2  4.   2  0100    NN18
D03MA  SR  Rudatsikira, Raphael                    A   1008200418MM 1002  8 UNOV11072026                              56.42Y     1 7     6       6  02      NN80
D3              Rudy                                                                                                                                         N29
G03MA          Rudatsikira, Raphael                    1 2  50C   26.81   56.42                                                                F             N76
D03MA  SR  Rudatsikira, Raphael                    A   1008200418MM 1001 16 UNOV11072026                              48.90Y     1 3     5  1.   5  0100    NN21
G03MA          Rudatsikira, Raphael                    1 2  50C   23.52   48.90                                                                F             N76
D03MA      Schaper, Ian                            A           FRMM 1003 10 UNOV11072026                            1:03.75Y     1 7     8       8  03      NN86
D3                                                                                                                                                           N67
G03MA          Schaper, Ian                            1 2  50C   29.76 1:03.75                                                                F             N73
D03MA      Schaper, Ian                            A           FRMM 2003 20 UNOV11072026                            2:21.21Y     1 7     6       6  03      NN86
G03MA          Schaper, Ian                            1 4  50C   30.34 1:05.87 1:42.89 2:21.21                                                F             N15
D03MA  SR  Schundler, Charles                      A   0713200419MM 1003 10 UNOV11072026                            1:01.09Y     1 3     5  1.   5  0300    NN60
D3              Jackson                                                                                                                                      N20
G03MA          Schundler, Charles                      1 2  50C   28.11 1:01.09                                                                F             N16
D03MA  SR  Schundler, Charles                      A   0713200419MM 2003 20 UNOV11072026                            2:20.32Y     1 3     5  1.   5  0300    NN60
G03MA          Schundler, Charles                      1 4  50C   30.49 1:05.07 1:41.89 2:20.32                                                F             N57
D03MA      Schwarz, Emily                          A           FRFF 1001 15 UNOV11072026                              57.91Y     1 7     7       7  01      NN67
D3                                                                                                                                                           N67
G03MA          Schwarz, Emily                          1 2  50C   28.34   57.91                                                                F             N54
D03MA      Schwarz, Emily                          A           FRFF 2001  5 UNOV11072026                            2:00.51Y     1 5     4  2.   4  0100    NN08
G03MA          Schwarz, Emily                          1 4  50C   28.11   58.81 1:30.08 2:00.51                                                F             N95
D03MA  SO  Steimel, Bailey                         A   0606200718MM 2004 12 UNOV11072026                            2:05.59Y     1 3     5  1.   5  0400    NN59
D3                                                                                                                                                           N67
G03MA          Steimel, Bailey                         1 4  50C   27.71   58.76 1:31.75 2:05.59                                                F             N26
D03MA  SO  Steimel, Bailey                         A   0606200718MM 1004 24 UNOV11072026                              56.10Y     1 7     6       6  04      NN98
G03MA          Steimel, Bailey                         1 2  50C   26.24   56.10                                                                F             N74
D03MA      Story, Brian                            A           FRMM 2001  6 UNOV11072026                            1:45.61Y     1 7     3  3.   3  0100    NN37
D3                                                                                                                                                           N67
G03MA          Story, Brian                            1 4  50C   24.47   51.21 1:18.27 1:45.61                                                F             N15
D03MA      Story, Brian                            A           FRMM 2003 20 UNOV11072026                            2:13.78Y     1 5     4  2.   4  0300    NN47
G03MA          Story, Brian                            1 4  50C   29.44 1:02.94 1:37.89 2:13.78                                                F             N55
D03MA      Van Schaften, Riley                     A           SOFF 2004 11 UNOV11072026                            2:08.58Y     1 5     2  4.   2  0400    NN59
D3                                                                                                                                                           N67
G03MA          Van Schaften, Riley                     1 4  50C   28.60 1:01.03 1:34.69 2:08.58                                                F             N57
D03MA      Van Schaften, Riley                     A           SOFF 1004 23 UNOV11072026                              58.48Y     1 7     3  3.   3  0400    NN39
G03MA          Van Schaften, Riley                     1 2  50C   27.86   58.48                                                                F             N95
D03MA      Waldman, Carly                          A           FRFF10001  3 UNOV11072026                           11:13.79Y     1 7     3  3.   3  0100    NN08
D3                                                                                                                                                           N67
G03MA          Waldman, Carly                          120  50C   30.39 1:03.89 1:37.87 2:12.00 2:46.20 3:20.34 3:54.42 4:28.64 5:02.75 5:36.87F             N50
G03MA          Waldman, Carly                          220  50C 6:10.89 6:44.71 7:18.47 7:52.41 8:26.28 9:00.09 9:34.1610:07.6710:40.8611:13.79F             N11
D03MA      Waldman, Carly                          A           FRFF 5001 21 UNOV11072026                            5:26.26Y     1 7     3  3.   3  0100    NN97
G03MA          Waldman, Carly                          110  50C   30.03 1:03.29 1:36.42 2:09.61 2:42.63 3:15.50 3:48.58 4:21.68 4:54.51 5:26.26F             N40
D03MA  SO  Winston, Toby                           A   0615200718MM 2001  6 UNOV11072026                            1:46.47Y     1 5     4  2.   4  0100    NN98
D3                                                                                                                                                           N67
G03MA          Winston, Toby                           1 4  50C   25.15   51.83 1:19.21 1:46.47                                                F             N75
D03MA  SO  Winston, Toby                           A   0615200718MM 1001 16 UNOV11072026                              46.57Y     1 5     1  9.   1  0100    NN88
G03MA          Winston, Toby                           1 2  50C   22.55   46.57                                                                F             N34
E03MA      AMAGETT  F 4007  1 UNOV  011072026                            3:59.68Y     1 5     2  4.                                            2N   0500X    N84
F03MA  SR      MAGETTAMcKenzie, Delanie                          0304200518F  1                           Lanie                                              N58
G03MA          McKenzie, Delanie                       1 8  50C   28.82   58.96                                                                F             N35
F03MA          MAGETTADolan, Reilly                                      FRF  2                                                                              N54
G03MA          Dolan, Reilly                           1 8  50C 1:30.54 2:06.07                                                                F             N44
F03MA  SO      MAGETTAPuckett, Morgan                            1118200717F  3                                                                              N46
G03MA          Puckett, Morgan                         1 8  50C 2:33.19 3:05.97                                                                F             N45
F03MA  SR      MAGETTAReck, Delaney                              0401200518F  4                                                                              N45
G03MA          Reck, Delaney                           1 8  50C 3:31.16 3:59.68                                                                F             N44
E03MA      BMAGETT  F 4007  1 UNOV  011072026                            4:02.72Y     1 3     3  2.                                            3N   0500X    N74
F03MA          MAGETTBJefferson, McKinley                                FRF  1                                                                              N76
G03MA          Jefferson, McKinley                     1 8  50C   29.19 1:00.64                                                                F             N46
F03MA  SR      MAGETTBCsokmay, Audrey                            1007200418F  2                                                                              N46
G03MA          Csokmay, Audrey                         1 8  50C 1:32.73 2:09.82                                                                F             N35
F03MA          MAGETTBDuprey, Caitrin                                    FRF  3                                                                              N45
G03MA          Duprey, Caitrin                         1 8  50C 2:36.75 3:07.56                                                                F             N45
F03MA          MAGETTBSchwarz, Emily                                     FRF  4                                                                              N05
G03MA          Schwarz, Emily                          1 8  50C 3:33.71 4:02.72                                                                F             N05
E03MA      CMAGETT  F 4007  1 UNOV  011072026                            4:05.63Y     1 7     4                                                4N   05  X    N44
F03MA          MAGETTCVan Schaften, Riley                                SOF  1                                                                              N46
G03MA          Van Schaften, Riley                     1 8  50C   29.40 1:01.26                                                                F             N06
F03MA  SO      MAGETTCHall, Kaitlin                              0923200718F  2                           Kait                                               N96
G03MA          Hall, Kaitlin                           1 8  50C 1:17.01 2:11.08                                                                F             N34
F03MA  JR      MAGETTCRacicot, Kristen                           0817200617F  3                                                                              N86
G03MA          Racicot, Kristen                        1 8  50C 2:38.33 3:10.65                                                                F             N75
F03MA          MAGETTCPeitler, Maya                                      FRF  4                                                                              N54
G03MA          Peitler, Maya                           1 8  50C 3:36.38 4:05.63                                                                F             N54
E03MA      AMAGETT  M 4007  2 UNOV  011072026                            3:24.25Y     1 5     2  4.                                            2N   0500X    N84
F03MA  JR      MAGETTAGraham, Evan                               0307200617M  1                                                                              N05
G03MA          Graham, Evan                            1 8  50C   24.65   51.05                                                                F             N53
F03MA          MAGETTAStory, Brian                                       FRM  2                                                                              N34
G03MA          Story, Brian                            1 8  50C 1:17.97 1:48.80                                                                F             N34
F03MA          MAGETTABurek, Ryan                                        FRM  3                                                                              N83
G03MA          Burek, Ryan                             1 8  50C 2:11.78 2:39.13                                                                F             N73
F03MA  SO      MAGETTAWinston, Toby                              0615200718M  4                                                                              N95
G03MA          Winston, Toby                           1 8  50C 3:00.41 3:24.25                                                                F             N74
E03MA      BMAGETT  M 4007  2 UNOV  011072026                            3:32.76Y     1 3     5                                                5N   05  X    N54
F03MA  JR      MAGETTBMangan, Connor                             0524200617M  1                                                                              N95
G03MA          Mangan, Connor                          1 8  50C   25.63   52.82                                                                F             N44
F03MA  SO      MAGETTBCampet, Benjamin                           0128200718M  2                           Ben                                                N67
G03MA          Campet, Benjamin                        1 8  50C 1:20.26 1:52.48                                                                F             N55
F03MA  SO      MAGETTBButterfield, Benjamin                      1012200618M  3                           Ben                                                N59
G03MA          Butterfield, Benjamin                   1 8  50C 2:16.40 2:44.32                                                                F             N57
F03MA  SO      MAGETTBBooth, Kellen                              0328200718M  4                                                                              N65
G03MA          Booth, Kellen                           1 8  50C 3:07.01 3:32.76                                                                F             N44
E03MA      CMAGETT  M 4007  2 UNOV  011072026                            3:37.94Y     1 7     6                                                6N   05  X    N54
F03MA          MAGETTCGalef, Will                                        FRM  1                                                                              N73
G03MA          Galef, Will                             1 8  50C   26.87   55.22                                                                F             N23
F03MA  SR      MAGETTCSchundler, Charles                         0713200419M  2                           Jackson                                            N10
G03MA          Schundler, Charles                      1 8  50C 1:22.68 1:55.72                                                                F             N46
F03MA  SO      MAGETTCSteimel, Bailey                            0606200718M  3                                                                              N36
G03MA          Steimel, Bailey                         1 8  50C 2:20.28 2:49.24                                                                F             N25
F03MA          MAGETTCSchaper, Ian                                       FRM  4                                                                              N14
G03MA          Schaper, Ian                            1 8  50C 3:12.21 3:37.94                                                                F             N04
E03MA      AMAGETT  F 2006 27 UNOV  011072026                            1:38.76Y     1 5     2  4.                                            2N   0100X    N94
F03MA  SR      MAGETTAReck, Delaney                              0401200518F  1                                                                              N45
G03MA          Reck, Delaney                           1 4  50C   25.18                                                                        F             N43
F03MA  SR      MAGETTAMcKenzie, Delanie                          0304200518F  2                           Lanie                                              N58
G03MA          McKenzie, Delanie                       1 4  50C   49.65                                                                        F             N84
F03MA  SO      MAGETTAMiller, Kathleen                           0129200718F  3                           Kate                                               N08
G03MA          Miller, Kathleen                        1 4  50C 1:14.57                                                                        F             N84
F03MA          MAGETTAPeitler, Maya                                      FRF  4                                                                              N54
G03MA          Peitler, Maya                           1 4  50C 1:38.76                                                                        F             N83
E03MA      BMAGETT  F 2006 27 UNOV  011072026                            1:43.07Y     1 3     5                                                5N   01  X    N54
F03MA  SO      MAGETTBPuckett, Morgan                            1118200717F  1                                                                              N46
G03MA          Puckett, Morgan                         1 4  50C   25.97                                                                        F             N44
F03MA          MAGETTBDuprey, Caitrin                                    FRF  2                                                                              N45
G03MA          Duprey, Caitrin                         1 4  50C   50.79                                                                        F             N44
F03MA          MAGETTBSchwarz, Emily                                     FRF  3                                                                              N05
G03MA          Schwarz, Emily                          1 4  50C 1:16.58                                                                        F             N34
F03MA          MAGETTBJefferson, McKinley                                FRF  4                                                                              N76
G03MA          Jefferson, McKinley                     1 4  50C 1:43.07                                                                        F             N95
E03MA      CMAGETT  F 2006 27 UNOV  011072026                            1:50.28Y     1 7     7                                                7N   01  X    N54
F03MA          MAGETTCKennedy, Kaileigh                                  FRF  1                                                                              N95
G03MA          Kennedy, Kaileigh                       1 4  50C   26.90                                                                        F             N94
F03MA  SR      MAGETTCMcKim, Paige                               0907200419F  2                                                                              N94
G03MA          McKim, Paige                            1 4  50C   55.06                                                                        F             N82
F03MA          MAGETTCWaldman, Carly                                     FRF  3                                                                              N94
G03MA          Waldman, Carly                          1 4  50C 1:21.83                                                                        F             N04
F03MA          MAGETTCNagle, Audrey                                      FRF  4                                                                              N54
G03MA          Nagle, Audrey                           1 4  50C 1:50.28                                                                        F             N63
E03MA      AMAGETT  M 2006 28 UNOV  011072026                            1:26.53Y     1 5     2  4.                                            2N   0100X    N94
F03MA  SO      MAGETTAWinston, Toby                              0615200718M  1                                                                              N95
G03MA          Winston, Toby                           1 4  50C   21.43                                                                        F             N73
F03MA          MAGETTABurek, Ryan                                        FRM  2                                                                              N83
G03MA          Burek, Ryan                             1 4  50C   43.49                                                                        F             N82
F03MA  SR      MAGETTAKim, Edward                                0822200518M  3                                                                              N74
G03MA          Kim, Edward                             1 4  50C 1:05.05                                                                        F             N82
F03MA  SR      MAGETTARudatsikira, Raphael                       1008200418M  4                           Rudy                                               N89
G03MA          Rudatsikira, Raphael                    1 4  50C 1:26.53                                                                        F             N46
E03MA      BMAGETT  M 2006 28 UNOV  011072026                            1:27.61Y     1 3     3  2.                                            3N   0100X    N94
F03MA          MAGETTBStory, Brian                                       FRM  1                                                                              N34
G03MA          Story, Brian                            1 4  50C   21.98                                                                        F             N33
F03MA  SO      MAGETTBButterfield, Benjamin                      1012200618M  2                           Ben                                                N59
G03MA          Butterfield, Benjamin                   1 4  50C   43.99                                                                        F             N66
F03MA  SO      MAGETTBBooth, Kellen                              0328200718M  3                                                                              N65
G03MA          Booth, Kellen                           1 4  50C 1:05.81                                                                        F             N73
F03MA  SR      MAGETTBMartin, Cole                               0404200518M  4                                                                              N25
G03MA          Martin, Cole                            1 4  50C 1:27.61                                                                        F             N33
E03MA      CMAGETT  M 2006 28 UNOV  011072026                            1:30.93Y     1 7     7                                                7N   01  X    N64
F03MA  SO      MAGETTCSteimel, Bailey                            0606200718M  1                                                                              N36
G03MA          Steimel, Bailey                         1 4  50C   22.94                                                                        F             N24
F03MA  SR      MAGETTCBooth, Connor                              0319200518M  2                                                                              N75
G03MA          Booth, Connor                           1 4  50C   45.36                                                                        F             N63
F03MA  SR      MAGETTCFloren Smith, Erik                         1109200418M  3                                                                              N17
G03MA          Floren Smith, Erik                      1 4  50C 1:08.64                                                                        F             N25
F03MA  JR      MAGETTCMangan, Connor                             0524200617M  4                                                                              N95
G03MA          Mangan, Connor                          1 4  50C 1:30.93                                                                        F             N14
E03MA      DMAGETT  M 2006 28 UNOV  011072026                            1:30.57Y     1 1     6                                                6N   01  X    N54
F03MA          MAGETTDSchaper, Ian                                       FRM  1                                                                              N04
G03MA          Schaper, Ian                            1 4  50C   22.87                                                                        F             N03
F03MA          MAGETTDHersey, Grayson                                    FRM  2                                                                              N55
G03MA          Hersey, Grayson                         1 4  50C   45.38                                                                        F             N54
F03MA  SR      MAGETTDNelson, Samuel                             0314200518M  3                           Sam                                                N17
G03MA          Nelson, Samuel                          1 4  50C 1:07.73                                                                        F             N24
F03MA          MAGETTDGalef, Will                                        FRM  4                                                                              N73
G03MA          Galef, Will                             1 4  50C 1:30.57                                                                        F             N82
Z03Meet Res02Successful Build on 11/7/2026   1  1   2   2   165    85   29   116   266                                                                       N59`;

// ============================================================================
// UTILITY FUNCTIONS & SDIF PARSING LOGIC
// ============================================================================

const STROKE_MAP = {
  '1': 'Freestyle',
  '2': 'Backstroke',
  '3': 'Breaststroke',
  '4': 'Butterfly',
  '5': 'Individual Medley',
  '6': 'Freestyle Relay',
  '7': 'Medley Relay',
};

const COURSE_MAP = {
  'Y': 'SCY (Yards)',
  'S': 'SCM (Short Course Meters)',
  'L': 'LCM (Long Course Meters)',
  '1': 'SCM',
  '2': 'SCY',
  '3': 'LCM',
};

const GENDER_MAP = {
  'M': 'Men',
  'F': 'Women',
  'X': 'Mixed',
};

// ============================================================================
// HISTORICAL BENCHMARK & GOOGLE SHEET NORMALIZATION HELPERS
// ============================================================================

/**
 * Normalizes a swimmer's name into a lowercase "first last" key for matching
 */
function normalizeSwimmerKey(rawName) {
  if (!rawName) return '';
  let str = String(rawName).trim();
  if (str.includes(',')) {
    const parts = str.split(',');
    str = `${parts[1]?.trim() || ''} ${parts[0]?.trim() || ''}`;
  }
  return str
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalizes event strings (e.g., "Women 1000 Freestyle", "Women's 1000 Free", "1000 Free - Women", "1000 Yard Freestyle")
 * into a canonical key ("women 1000 freestyle")
 */
function normalizeEventKey(rawEvent, fallbackGender = '') {
  if (!rawEvent) return '';
  const str = String(rawEvent)
    .toLowerCase()
    .replace(/['’]s\b/g, '')
    .replace(/\b(yard|yards|scy|scm|lcm|meter|meters)\b/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  let gender = '';
  if (/\b(women|woman|female|girls|w)\b/.test(str)) gender = 'women';
  else if (/\b(men|man|male|boys|m)\b/.test(str)) gender = 'men';
  else if (/\b(mixed|x)\b/.test(str)) gender = 'mixed';
  else if (fallbackGender) gender = fallbackGender.toLowerCase();

  const distMatch = str.match(/\b(25|50|100|200|400|500|800|1000|1500|1650)\b/);
  const distance = distMatch ? distMatch[1] : '';

  let stroke = '';
  if (/\b(medley relay|med rel|medley rel)\b/.test(str)) stroke = 'medley relay';
  else if (/\b(free relay|freestyle relay|free rel)\b/.test(str)) stroke = 'freestyle relay';
  else if (/\b(im|individual medley|ind medley)\b/.test(str)) stroke = 'individual medley';
  else if (/\b(free|freestyle)\b/.test(str)) stroke = 'freestyle';
  else if (/\b(back|backstroke)\b/.test(str)) stroke = 'backstroke';
  else if (/\b(breast|breaststroke)\b/.test(str)) stroke = 'breaststroke';
  else if (/\b(fly|butterfly)\b/.test(str)) stroke = 'butterfly';

  if (!distance || !stroke) return '';
  return [gender, distance, stroke].filter(Boolean).join(' ');
}

/**
 * Parses flexible date strings ("2026-02-14", "Nov 7, 2026", "11/07/2026") into a Date object
 */
function parseFlexibleDate(dateStr) {
  if (!dateStr) return null;
  const s = String(dateStr).trim();
  const isoMatch = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    return new Date(
      parseInt(isoMatch[1], 10),
      parseInt(isoMatch[2], 10) - 1,
      parseInt(isoMatch[3], 10)
    );
  }
  const parsed = new Date(s);
  return isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Parses TSV or CSV rows matching the user's exact 12-column Google Sheet layout:
 * Name | Class | Event | Min | Sec | Date | Location | Competition | Place | Time | Event | Seconds
 * (Also gracefully falls back if Min/Sec or duplicate Event columns vary)
 */
function parseGoogleSheetHistory(rawText) {
  const lines = rawText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return [];

  // Auto-detect delimiter (Tab from Google Sheets copy-paste vs Comma from CSV export)
  const delimiter = lines[0].includes('\t') ? '\t' : ',';

  const splitRow = (line) => {
    if (delimiter === '\t') {
      return line.split('\t').map((c) => c.trim().replace(/^"|"$/g, ''));
    }
    const cols = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        cols.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    cols.push(cur.trim());
    return cols;
  };

  const firstRow = splitRow(lines[0]).map((h) => h.toLowerCase());
  const hasHeader =
    firstRow.includes('name') || firstRow.includes('event') || firstRow.includes('time');

  // Find all indices of 'event' (since user's sheet has Event at col 2 and canonical Event at col 10)
  const eventIndices = firstRow
    .map((h, idx) => (h === 'event' ? idx : -1))
    .filter((idx) => idx !== -1);

  const colIdx = {
    name: hasHeader ? firstRow.indexOf('name') : 0,
    classYear: hasHeader ? firstRow.indexOf('class') : 1,
    eventPrimary: hasHeader ? (eventIndices[0] ?? 2) : 2,
    eventCanonical: hasHeader ? (eventIndices[1] ?? eventIndices[0] ?? 10) : 10,
    min: hasHeader ? firstRow.indexOf('min') : 3,
    sec: hasHeader ? firstRow.indexOf('sec') : 4,
    date: hasHeader ? firstRow.indexOf('date') : 5,
    location: hasHeader ? firstRow.indexOf('location') : 6,
    competition: hasHeader ? firstRow.indexOf('competition') : 7,
    place: hasHeader ? firstRow.indexOf('place') : 8,
    time: hasHeader ? firstRow.indexOf('time') : 9,
    seconds: hasHeader ? firstRow.indexOf('seconds') : 11,
  };

  const normalizeClass = (rawCls) => {
    const c = String(rawCls || '').replace(/\./g, '').trim().toUpperCase();
    if (['FR', 'FRESHMAN', '1', 'FY'].includes(c)) return 'FR';
    if (['SO', 'SOPHOMORE', '2'].includes(c)) return 'SO';
    if (['JR', 'JUNIOR', '3'].includes(c)) return 'JR';
    if (['SR', 'SENIOR', '4', 'GR', 'GRAD'].includes(c)) return 'SR';
    return c;
  };

  const startIdx = hasHeader ? 1 : 0;
  const entries = [];

  for (let i = startIdx; i < lines.length; i++) {
    const cols = splitRow(lines[i]);
    const nameRaw = cols[colIdx.name >= 0 ? colIdx.name : 0] || '';
    const classYear = normalizeClass(cols[colIdx.classYear >= 0 ? colIdx.classYear : 1]);
    const eventColA = cols[colIdx.eventPrimary >= 0 ? colIdx.eventPrimary : 2] || '';
    const eventColB = cols[colIdx.eventCanonical >= 0 ? colIdx.eventCanonical : 10] || '';
    // Prefer the canonical long Event column (col 11 / index 10) if populated, otherwise col 3 (index 2)
    const eventRaw = eventColB || eventColA;

    const minRaw = cols[colIdx.min >= 0 ? colIdx.min : 3] || '';
    const secPartRaw = cols[colIdx.sec >= 0 ? colIdx.sec : 4] || '';
    const dateRaw = cols[colIdx.date >= 0 ? colIdx.date : 5] || '';
    const locationRaw = cols[colIdx.location >= 0 ? colIdx.location : 6] || '';
    const competitionRaw = cols[colIdx.competition >= 0 ? colIdx.competition : 7] || '';
    const placeRaw = cols[colIdx.place >= 0 ? colIdx.place : 8] || '';
    const timeRaw = cols[colIdx.time >= 0 ? colIdx.time : 9] || '';
    const totalSecondsRaw = cols[colIdx.seconds >= 0 ? colIdx.seconds : 11] || '';

    if (!eventRaw || !nameRaw) continue;

    // Place = "R" (flying relay split) or "S" (mid-race split like 1000 inside 1650)
    // Exclude non-official splits from official PB/SB/Top-10/Freshman Record benchmarks
    const placeFlag = placeRaw.trim().toUpperCase();
    const isUnofficialSplit = placeFlag === 'R' || placeFlag === 'S';

    // Resolve total seconds from:
    // 1. Explicit 'Seconds' column (col 12)
    // 2. Formatted 'Time' column (col 10)
    // 3. 'Min' + 'Sec' columns (cols 4 & 5)
    let totalSec = parseFloat(totalSecondsRaw);
    if (!isFinite(totalSec) || totalSec <= 0) {
      totalSec = timeToSeconds(timeRaw);
    }
    if (!isFinite(totalSec) || totalSec <= 0) {
      const mVal = parseFloat(minRaw) || 0;
      const sVal = parseFloat(secPartRaw);
      if (isFinite(sVal) && sVal > 0) {
        totalSec = mVal * 60 + sVal;
      }
    }
    if (!isFinite(totalSec) || totalSec <= 0) continue;

    const formattedTime = timeRaw || secondsToTime(totalSec);
    const parsedDate = parseFlexibleDate(dateRaw);
    // Try canonical event key from eventRaw, fallback to eventColA if needed
    const eventKey =
      normalizeEventKey(eventRaw) || normalizeEventKey(eventColA);

    const placeClean = String(placeRaw || '').trim().toUpperCase();
    const isSplitEntry = placeClean === 'R' || placeClean === 'S';

    entries.push({
      id: `hist-${i}-${nameRaw}-${eventRaw}`,
      source: 'sheet',
      eventRaw,
      eventKey,
      nameRaw,
      nameKey: normalizeSwimmerKey(nameRaw),
      classYear,
      time: formattedTime,
      seconds: totalSec,
      date: dateRaw,
      dateObj: parsedDate,
      place: placeRaw,
      location: locationRaw,
      competition: competitionRaw,
      isOfficial: !isSplitEntry,
    });
  }

  return entries;
}

// Sample Google Sheet historical rows matching exact 12-column schema:
// Name | Class | Event | Min | Sec | Date | Location | Competition | Place | Time | Event | Seconds
const SAMPLE_GOOGLE_SHEET_CSV = `Name,Class,Event,Min,Sec,Date,Location,Competition,Place,Time,Event,Seconds
Ava Berry,JR,1000 Free,10,45.10,2026-02-14,Lancaster PA,Centennial Conference Championships,3,10:45.10,Women 1000 Freestyle,645.10
Ava Berry,SR,1000 Free,10,51.40,2026-10-24,Gettysburg PA,Gettysburg vs Dickinson,1,10:51.40,Women 1000 Freestyle,651.40
Kaileigh Kennedy,FR,1000 Free,11,08.50,2026-10-24,Gettysburg PA,Gettysburg vs Dickinson,2,11:08.50,Women 1000 Freestyle,668.50
Sam Nelson,JR,1000 Free,9,48.90,2026-02-14,Lancaster PA,Centennial Conference Championships,2,9:48.90,Men 1000 Freestyle,588.90
Sam Nelson,SR,1000 Free,9,54.12,2026-10-24,Gettysburg PA,Gettysburg vs Dickinson,1,9:54.12,Men 1000 Freestyle,594.12
Toby Winston,FR,100 Free,0,46.85,2026-02-15,Lancaster PA,Centennial Conference Championships,2,46.85,Men 100 Freestyle,46.85
Toby Winston,SO,100 Free,0,47.20,2026-10-24,Gettysburg PA,Gettysburg vs Dickinson,1,47.20,Men 100 Freestyle,47.20
Evan Graham,SO,100 Free,0,47.10,2025-02-16,Lancaster PA,Centennial Conference Championships,3,47.10,Men 100 Freestyle,47.10
Caitrin Duprey,FR,200 IM,2,09.40,2026-10-24,Gettysburg PA,Gettysburg vs Dickinson,1,2:09.40,Women 200 Individual Medley,129.40
Sarah Chen,FR,200 Back,2,09.50,2025-02-15,Atlanta GA,UAA Championships,4,2:09.50,Women 200 Backstroke,129.50
Audrey Gil,FR,50 Free,0,24.30,2026-02-13,Atlanta GA,UAA Championships,2,24.30,Women 50 Freestyle,24.30
Delaney Reck,JR,50 Free,0,24.45,2026-02-13,Lancaster PA,Centennial Conference Championships,2,24.45,Women 50 Freestyle,24.45`;

/**
 * Safely slices 1-based fixed-width SDIF columns (inclusive) and trims whitespace
 */
function sliceCol(line, start1Based, end1Based) {
  if (!line || line.length < start1Based) return '';
  return line.slice(start1Based - 1, end1Based).trim();
}

/**
 * Formats MMDDYYYY into a readable date string (e.g., Nov 7, 2026)
 */
function formatDateSDIF(raw) {
  if (!raw || raw.length !== 8) return raw || '';
  const mm = parseInt(raw.slice(0, 2), 10);
  const dd = parseInt(raw.slice(2, 4), 10);
  const yyyy = raw.slice(4, 8);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
    return `${months[mm - 1]} ${dd}, ${yyyy}`;
  }
  return raw;
}

/**
 * Converts swim time string ("22.44", "1:44.14", "10:01.66") to total seconds
 */
function timeToSeconds(timeStr) {
  if (!timeStr) return Infinity;
  const cleaned = timeStr.replace(/[A-Za-z]/g, '').trim();
  if (!cleaned || ['NT', 'NS', 'DQ', 'SCR', 'DNF'].includes(cleaned.toUpperCase())) return Infinity;
  const parts = cleaned.split(':');
  if (parts.length === 2) {
    const mins = parseFloat(parts[0]);
    const secs = parseFloat(parts[1]);
    return isNaN(mins) || isNaN(secs) ? Infinity : mins * 60 + secs;
  }
  const val = parseFloat(cleaned);
  return isNaN(val) ? Infinity : val;
}

/**
 * Formats seconds back into "M:SS.hh" or "SS.hh"
 */
function secondsToTime(sec) {
  if (!isFinite(sec) || sec < 0) return '-';
  const mins = Math.floor(sec / 60);
  const rem = sec % 60;
  if (mins > 0) {
    return `${mins}:${rem.toFixed(2).padStart(5, '0')}`;
  }
  return rem.toFixed(2);
}

/**
 * Formats "Last, First M" into "First Last", substituting preferredFirst/nickname if available
 */
function formatSwimmerDisplay(rawName, preferredFirst) {
  if (!rawName) return 'Unknown Swimmer';
  const parts = rawName.split(',');
  if (parts.length < 2) return preferredFirst ? `${preferredFirst} ${rawName}` : rawName;
  const lastName = parts[0].trim();
  const firstPart = parts[1].trim();
  const displayFirst = preferredFirst && preferredFirst.trim() ? preferredFirst.trim() : firstPart;
  return `${displayFirst} ${lastName}`;
}

/**
 * Core Fixed-Width Hy-Tek SDIF (.cl2 / .sd3) Parser
 */
function parseSDIFContent(content) {
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) {
    throw new Error('The uploaded file is empty.');
  }

  // Basic validation: SDIF records typically begin with A0, B1, C1, D0, E0, etc.
  const validPrefixes = ['A0', 'B1', 'B2', 'C1', 'C2', 'D0', 'D1', 'D2', 'D3', 'E0', 'F0', 'G0', 'Z0'];
  const hasValidHeader = lines.some((l) => validPrefixes.includes(l.slice(0, 2)));
  if (!hasValidHeader) {
    throw new Error('Invalid file format. No standard SDIF/CL2 record identifiers (A0, B1, C1, D0, E0) were found.');
  }

  const meetInfo = {
    name: 'Swim Meet Results',
    city: '',
    state: '',
    startDate: '',
    software: '',
  };

  const teamsMap = new Map(); // teamCode -> { code, name, city, state, swimmers: Set }
  const individualResults = [];
  const relayResults = [];

  let currentTeamContext = null;
  let lastRecordType = null; // 'D0' | 'E0' | 'F0'
  let lastD0 = null;
  let lastE0 = null;
  let lastF0 = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const recType = line.slice(0, 2);

    if (recType === 'A0') {
      meetInfo.software = sliceCol(line, 44, 63) || sliceCol(line, 64, 73);
    } else if (recType === 'B1') {
      // Exact 1-based SDIF B1 column layout:
      // Cols 12-41: Meet Name ("Gettysburg v Carnegie Mellon")
      // Cols 86-105: Meet City ("Gettysburg")
      // Cols 106-107: Meet State ("PA")
      // Cols 108-117: Postal Code ("17325")
      // Cols 122-129: Meet Start Date ("11072026")
      meetInfo.name = sliceCol(line, 12, 41) || 'Unnamed Swim Meet';
      meetInfo.city = sliceCol(line, 86, 105);
      meetInfo.state = sliceCol(line, 106, 107);
      meetInfo.startDate = formatDateSDIF(sliceCol(line, 122, 129));
    } else if (recType === 'C1') {
      const code = sliceCol(line, 12, 17);
      const name = sliceCol(line, 18, 47) || code;
      const city = sliceCol(line, 110, 129);
      const state = sliceCol(line, 130, 131);
      if (code) {
        currentTeamContext = code;
        if (!teamsMap.has(code)) {
          teamsMap.set(code, {
            code,
            name,
            city,
            state,
            swimmers: new Map(), // name -> { name, preferredFirst, gender, classYear, swimsCount }
          });
        }
      }
    } else if (recType === 'D0') {
      // Individual Event Record
      // Cols 4-9 often contain the LSC+Team or Team prefix; fallback to currentTeamContext
      const rawTeamSlice = sliceCol(line, 4, 9);
      let teamCode = currentTeamContext || rawTeamSlice || 'UNAT';
      // Match against registered C1 team codes if rawTeamSlice is a prefix (e.g., "AM" -> "AMCMU")
      if (rawTeamSlice) {
        for (const [registeredCode] of teamsMap.entries()) {
          if (registeredCode.startsWith(rawTeamSlice) || rawTeamSlice === registeredCode) {
            teamCode = registeredCode;
            break;
          }
        }
      }

      const classYear = sliceCol(line, 8, 9);
      const swimmerName = sliceCol(line, 12, 39);
      // Exact 1-based SDIF D0 column layout:
      // Cols 56-63: Birthdate (MMDDYYYY)
      // Cols 64-65: Age / Class ('20', 'FR', etc.)
      // Col 66: Swimmer Sex ('M' / 'F')
      // Col 67: Event Sex ('M' / 'F' / 'X')
      // Cols 68-71: Event Distance ('  50', ' 100', '1000')
      // Col 72: Stroke Code ('1'..'5')
      // Cols 73-76: Event Number ('  3', '  4', ' 14')
      const genderCode = sliceCol(line, 67, 67) || sliceCol(line, 66, 66);
      const distance = sliceCol(line, 68, 71);
      const strokeCode = sliceCol(line, 72, 72);
      const eventNumber = sliceCol(line, 73, 76);
      const finalsTimeRaw = sliceCol(line, 116, 123);
      const courseCode = sliceCol(line, 124, 124);

      // Parse Heat, Lane, Place, and Points from trailing columns (cols 126-152 in Hy-Tek CL2)
      // Example: "22.44Y     1 8     7       7  01" (no points) vs "48.76Y     1 2     4  2.   4  0100" (2 pts)
      const tailTokens = line.slice(125, 152).trim().split(/\s+/);
      const heat = tailTokens[0] || '';
      const lane = tailTokens[1] || '';
      const placeRaw = (tailTokens[2] || '').replace(/\./g, '');
      const place = /^\d+$/.test(placeRaw) ? parseInt(placeRaw, 10) : null;
      const pointsToken = tailTokens[3] || '';
      const points = /^\d+\.$/.test(pointsToken) ? parseFloat(pointsToken) : 0;

      const strokeName = STROKE_MAP[strokeCode] || `Stroke ${strokeCode}`;
      const genderLabel = GENDER_MAP[genderCode] || genderCode || 'Open';
      const eventLabel = `${genderLabel} ${distance} ${strokeName}`;

      const record = {
        id: `ind-${i}-${swimmerName}-${eventNumber}`,
        type: 'individual',
        teamCode,
        teamName: teamsMap.get(teamCode)?.name || teamCode,
        swimmerName,
        preferredFirst: '',
        classYear: ['FR', 'SO', 'JR', 'SR'].includes(classYear) ? classYear : '',
        genderCode,
        genderLabel,
        distance: parseInt(distance, 10) || distance,
        strokeCode,
        strokeName,
        eventNumber: parseInt(eventNumber, 10) || eventNumber,
        eventLabel,
        finalsTime: finalsTimeRaw || 'NT',
        timeSeconds: timeToSeconds(finalsTimeRaw),
        course: COURSE_MAP[courseCode] || courseCode || 'SCY',
        heat,
        lane,
        place: place || null,
        points,
        splitInterval: 50,
        splitType: 'C',
        splitPages: [],
        splits: [],
      };

      individualResults.push(record);
      lastD0 = record;
      lastRecordType = 'D0';

      // Track swimmer in team roster
      if (!teamsMap.has(teamCode)) {
        teamsMap.set(teamCode, {
          code: teamCode,
          name: teamCode,
          city: '',
          state: '',
          swimmers: new Map(),
        });
      }
      const roster = teamsMap.get(teamCode).swimmers;
      if (!roster.has(swimmerName)) {
        roster.set(swimmerName, {
          name: swimmerName,
          preferredFirst: '',
          gender: genderLabel,
          classYear: record.classYear,
          events: [],
        });
      }
      roster.get(swimmerName).events.push(`${distance} ${strokeName} (${finalsTimeRaw || 'NT'})`);
    } else if (recType === 'D3') {
      // Swimmer Info Record:
      // Cols 3-14: 12-char Swimmer ID, Cols 15-16: 2-char ID Checksum, Cols 17-31: Preferred First Name
      const prefFirst = sliceCol(line, 17, 31).trim();
      if (prefFirst && lastD0) {
        lastD0.preferredFirst = prefFirst;
        const roster = teamsMap.get(lastD0.teamCode)?.swimmers;
        if (roster && roster.has(lastD0.swimmerName)) {
          roster.get(lastD0.swimmerName).preferredFirst = prefFirst;
        }
      }
    } else if (recType === 'E0') {
      // Relay Event Record (Exact 1-based fixed-width column positions in Hy-Tek CL2):
      // Example line:
      // E03AM      AAMCMU   F 4007  1 UNOV  011072026                            3:57.64Y     1 4     1 11.                                            1N   0500X    N64
      // Col 12: Relay Team Letter ('A')
      // Cols 13-18: Team Code ('AMCMU ')
      // Col 21: Relay Gender ('F' = Women, 'M' = Men, 'X' = Mixed)
      // Cols 23-25: Relay Distance ('400', '200')
      // Col 26: Stroke Code ('6' = Freestyle Relay, '7' = Medley Relay)
      // Cols 27-30: Event Number ('  1', '  2', ' 27', ' 28')
      // Cols 72-80: Finals Time (' 3:57.64', ' 1:23.12')
      // Col 81: Course Code ('Y')
      const relayLetter = sliceCol(line, 12, 12) || 'A';
      const teamCode = sliceCol(line, 13, 18) || currentTeamContext || 'UNAT';
      const genderCode = sliceCol(line, 21, 21);
      const distance = sliceCol(line, 23, 25);
      const strokeCode = sliceCol(line, 26, 26);
      const eventNumber = sliceCol(line, 27, 30);
      const finalsTimeRaw = sliceCol(line, 72, 80);
      const courseCode = sliceCol(line, 81, 81);

      // Parse Heat, Lane, Place, and Points from trailing tokens after course code (cols 82-115)
      // Example: "3:57.64Y     1 4     1 11.   ..." (11 pts) vs "4:07.33Y     1 6     5   ..." (0 pts)
      const tailTokens = line.slice(81, 115).trim().split(/\s+/);
      const heat = tailTokens[0] || '';
      const lane = tailTokens[1] || '';
      const placeRaw = (tailTokens[2] || '').replace(/\./g, '');
      const place = /^\d+$/.test(placeRaw) ? parseInt(placeRaw, 10) : null;
      const pointsToken = tailTokens[3] || '';
      const points = /^\d+\.$/.test(pointsToken) ? parseFloat(pointsToken) : 0;

      const strokeName = STROKE_MAP[strokeCode] || 'Relay';
      const genderLabel = GENDER_MAP[genderCode] || genderCode || 'Mixed';
      const eventLabel = `${genderLabel} ${distance} ${strokeName}`;

      const relayObj = {
        id: `rel-${i}-${teamCode}-${relayLetter}-${eventNumber}`,
        type: 'relay',
        relayLetter,
        teamCode,
        teamName: teamsMap.get(teamCode)?.name || teamCode,
        relayTitle: `${teamsMap.get(teamCode)?.name || teamCode} "${relayLetter}"`,
        genderCode,
        genderLabel,
        distance: parseInt(distance, 10) || distance,
        strokeCode,
        strokeName,
        eventNumber: parseInt(eventNumber, 10) || eventNumber,
        eventLabel,
        finalsTime: finalsTimeRaw || 'NT',
        timeSeconds: timeToSeconds(finalsTimeRaw),
        course: COURSE_MAP[courseCode] || courseCode || 'SCY',
        heat,
        lane,
        place,
        points,
        splitInterval: 50,
        splitType: 'C',
        splitPages: [],
        legs: [],
        splits: [],
      };

      relayResults.push(relayObj);
      lastE0 = relayObj;
      lastRecordType = 'E0';
    } else if (recType === 'F0') {
      // Relay Swimmer Leg Record (Exact 1-based fixed-width column positions in Hy-Tek CL2):
      // Cols 8-9: Class Year ('FR', 'SO', 'JR', 'SR')
      // Cols 16-21: Team Code ('AMCMU ', 'MAGETT')
      // Col 22: Relay Team Letter ('A', 'B', 'C', 'D')
      // Cols 23-50: Swimmer Name ("Chen, Sarah Y", "Zaniolo, Anna G")
      // Note: If a file shifts 1 col left, col 22 may hold the relay letter immediately
      // followed by the capital first letter of the last name (e.g., "AChen, Sarah Y").
      // Stripping /^[A-Z](?=[A-Z])/ safely removes any stray relay squad letter without
      // ever clipping real names like "Aaron" or "Audrey" (which have lowercase 2nd letters).
      const rawF0Name = sliceCol(line, 22, 50);
      const swimmerName = rawF0Name.replace(/^[A-Z](?=[A-Z])/, '').trim();
      const legOrderRaw = sliceCol(line, 77, 77);
      const classYear = sliceCol(line, 8, 9);
      // Cols 93-104: 12-char Swimmer ID, Cols 105-106: 2-char ID Checksum ('40', '4F'), Cols 107-122: Preferred First Name
      const prefFirst = sliceCol(line, 107, 122).trim();

      const parsedLegOrder =
        /^[1-4]$/.test(legOrderRaw)
          ? parseInt(legOrderRaw, 10)
          : lastE0
          ? lastE0.legs.length + 1
          : 1;

      const legObj = {
        legOrder: parsedLegOrder,
        swimmerName,
        preferredFirst: prefFirst,
        classYear: ['FR', 'SO', 'JR', 'SR'].includes(classYear) ? classYear : '',
        splitInterval: 50,
        splitType: 'C',
        splitPages: [],
        splits: [],
      };

      if (lastE0) {
        lastE0.legs.push(legObj);
        // Ensure legs are always strictly sorted 1 -> 2 -> 3 -> 4
        lastE0.legs.sort((a, b) => a.legOrder - b.legOrder);

        // Also ensure relay-only swimmers appear on team roster
        const tCode = lastE0.teamCode;
        if (teamsMap.has(tCode) && swimmerName) {
          const roster = teamsMap.get(tCode).swimmers;
          if (!roster.has(swimmerName)) {
            roster.set(swimmerName, {
              name: swimmerName,
              preferredFirst: prefFirst,
              gender: lastE0.genderLabel,
              classYear: legObj.classYear,
              events: [`${lastE0.distance} ${lastE0.strokeName} (Relay Leg ${legObj.legOrder})`],
            });
          }
        }
      }
      lastF0 = legObj;
      lastRecordType = 'F0';
    } else if (recType === 'G0') {
      // Exact Fixed-Width SDIF G0 Record Layout (0-indexed):
      // - Index 55: Sequence / Page Number (e.g., '1', '2' for 1000-yard swims)
      // - Index 56..58: Total Splits Count (e.g., ' 2', ' 4', ' 8', '10', '20')
      // - Index 58..62: Split Distance Interval (e.g., '  50')
      // - Index 62: Split Type ('C' = Cumulative, 'I' = Interval)
      // - Index 63..143: 80-character splits block = 10 fixed-width 8-character slots!
      const seqRaw = line.slice(55, 56).trim();
      const seqNum = /^\d+$/.test(seqRaw) ? parseInt(seqRaw, 10) : 1;
      const intervalRaw = line.slice(58, 62).trim();
      const splitInterval = /^\d+$/.test(intervalRaw) ? parseInt(intervalRaw, 10) : 50;
      const splitType = line.slice(62, 63).trim() || 'C';

      const parsedSplits = [];
      for (let s = 0; s < 10; s++) {
        const startIdx = 63 + s * 8;
        const endIdx = 63 + (s + 1) * 8;
        if (line.length <= startIdx) break;
        const chunk = line.slice(startIdx, endIdx).trim();
        if (chunk && /[\d:.]/.test(chunk)) {
          parsedSplits.push(chunk);
        }
      }

      if (parsedSplits.length > 0) {
        const attachSplits = (target) => {
          if (!target) return;
          target.splitInterval = splitInterval;
          target.splitType = splitType;
          target.splitPages.push({ seq: seqNum, splits: parsedSplits });
          target.splitPages.sort((a, b) => a.seq - b.seq);
          target.splits = target.splitPages.flatMap((p) => p.splits);
        };

        if (lastRecordType === 'D0' && lastD0) {
          attachSplits(lastD0);
        } else if (lastRecordType === 'F0' && lastF0 && lastE0) {
          attachSplits(lastF0);
          // Rebuild E0 combined splits in leg order 1 -> 4
          lastE0.legs.sort((a, b) => a.legOrder - b.legOrder);
          lastE0.splitInterval = splitInterval;
          lastE0.splitType = splitType;
          lastE0.splits = lastE0.legs.flatMap((leg) => leg.splits);
        } else if (lastRecordType === 'E0' && lastE0) {
          attachSplits(lastE0);
        }
      }
    }
  }

  // Propagate preferredFirst across all individual & relay appearances of the same swimmer
  const preferredBySwimmerKey = new Map();
  teamsMap.forEach((team, tCode) => {
    team.swimmers.forEach((sw, sName) => {
      if (sw.preferredFirst) {
        preferredBySwimmerKey.set(`${tCode}|${sName}`, sw.preferredFirst);
      }
    });
  });

  individualResults.forEach((rec) => {
    if (!rec.preferredFirst) {
      rec.preferredFirst = preferredBySwimmerKey.get(`${rec.teamCode}|${rec.swimmerName}`) || '';
    }
  });

  relayResults.forEach((rel) => {
    rel.legs.forEach((leg) => {
      if (!leg.preferredFirst) {
        leg.preferredFirst = preferredBySwimmerKey.get(`${rel.teamCode}|${leg.swimmerName}`) || '';
      }
    });
  });

  // Convert teamsMap to array with sorted rosters
  const teams = Array.from(teamsMap.values()).map((t) => ({
    ...t,
    swimmerList: Array.from(t.swimmers.values()).sort((a, b) => a.name.localeCompare(b.name)),
  }));

  // Calculate Team Scores broken down by Women, Men, and Combined
  const teamScoresMap = new Map();
  teams.forEach((t) => {
    teamScoresMap.set(t.code, {
      code: t.code,
      name: t.name,
      womenPoints: 0,
      menPoints: 0,
      totalPoints: 0,
    });
  });

  const addScore = (teamCode, genderLabel, pts) => {
    if (!pts || pts <= 0) return;
    if (!teamScoresMap.has(teamCode)) {
      teamScoresMap.set(teamCode, {
        code: teamCode,
        name: teamCode,
        womenPoints: 0,
        menPoints: 0,
        totalPoints: 0,
      });
    }
    const entry = teamScoresMap.get(teamCode);
    if (genderLabel === 'Women') entry.womenPoints += pts;
    else if (genderLabel === 'Men') entry.menPoints += pts;
    entry.totalPoints += pts;
  };

  individualResults.forEach((r) => addScore(r.teamCode, r.genderLabel, r.points));
  relayResults.forEach((r) => addScore(r.teamCode, r.genderLabel, r.points));

  const teamScores = Array.from(teamScoresMap.values()).sort(
    (a, b) => b.totalPoints - a.totalPoints
  );

  const totalUniqueSwimmers = teams.reduce((acc, t) => acc + t.swimmerList.length, 0);

  return {
    meetInfo,
    teams,
    teamScores,
    individualResults,
    relayResults,
    stats: {
      totalTeams: teams.length,
      totalSwimmers: totalUniqueSwimmers,
      totalIndividualSwims: individualResults.length,
      totalRelays: relayResults.length,
      totalSwims: individualResults.length + relayResults.length,
    },
  };
}

/**
 * Computes cumulative & lap-by-lap splits from G0 split records,
 * supporting both 'C' (Cumulative) and 'I' (Interval) split modes,
 * plus pacing analytics (fastest, slowest, average lap).
 */
function calculateSplitBreakdown(rawSplits, totalDistance, splitInterval = 50, splitType = 'C') {
  if (!rawSplits || rawSplits.length === 0) return { rows: [], stats: null };

  const interval =
    splitInterval && splitInterval > 0
      ? splitInterval
      : totalDistance && rawSplits.length > 0
      ? Math.round(totalDistance / rawSplits.length)
      : 50;

  let prevCumSeconds = 0;
  const rows = rawSplits.map((splitStr, idx) => {
    const valSec = timeToSeconds(splitStr);
    let cumSec = Infinity;
    let lapSec = Infinity;

    if (splitType === 'I') {
      lapSec = valSec;
      cumSec = isFinite(valSec) ? prevCumSeconds + valSec : Infinity;
    } else {
      // Default 'C' (Cumulative)
      cumSec = valSec;
      lapSec = isFinite(cumSec) ? cumSec - prevCumSeconds : Infinity;
    }

    if (isFinite(cumSec)) {
      prevCumSeconds = cumSec;
    }

    return {
      index: idx + 1,
      distance: (idx + 1) * interval,
      distanceLabel: `${(idx + 1) * interval}y`,
      cumulative: splitType === 'I' ? secondsToTime(cumSec) : splitStr,
      cumulativeSec: cumSec,
      lap: isFinite(lapSec) && lapSec > 0 ? secondsToTime(lapSec) : splitStr,
      lapSec: isFinite(lapSec) && lapSec > 0 ? lapSec : Infinity,
    };
  });

  // Calculate pacing stats (excluding opening 50 dive start when comparing swimming laps if >= 3 splits, or across all laps)
  const validLaps = rows.filter((r) => isFinite(r.lapSec) && r.lapSec > 0);
  if (validLaps.length === 0) {
    return { rows, stats: null };
  }

  const allLapSecs = validLaps.map((r) => r.lapSec);
  const minLap = Math.min(...allLapSecs);
  const maxLap = Math.max(...allLapSecs);
  const avgLap = allLapSecs.reduce((acc, v) => acc + v, 0) / allLapSecs.length;

  // Negative/Positive split check (2nd half vs 1st half)
  let halfDiff = null;
  if (rows.length >= 2 && rows.length % 2 === 0) {
    const mid = rows.length / 2;
    const firstHalfSec = rows[mid - 1].cumulativeSec;
    const totalSec = rows[rows.length - 1].cumulativeSec;
    if (isFinite(firstHalfSec) && isFinite(totalSec)) {
      const secondHalfSec = totalSec - firstHalfSec;
      halfDiff = secondHalfSec - firstHalfSec; // negative = negative split!
    }
  }

  return {
    rows: rows.map((r) => ({
      ...r,
      isFastest: validLaps.length > 1 && Math.abs(r.lapSec - minLap) < 0.005,
      isSlowest: validLaps.length > 1 && Math.abs(r.lapSec - maxLap) < 0.005,
    })),
    stats: {
      interval,
      minLap,
      maxLap,
      avgLap: secondsToTime(avgLap),
      avgLapSec: avgLap,
      halfDiff,
    },
  };
}

/**
 * Computes structured leg-by-leg splits for a relay from each leg's G0 cumulative split(s)
 */
function calculateRelayLegBreakdown(relay) {
  let prevCumulativeSec = 0;
  const interval = relay.splitInterval || 50;

  return relay.legs.map((leg) => {
    const legSubSplits = [];
    let legStartSec = prevCumulativeSec;

    if (leg.splits && leg.splits.length > 0) {
      leg.splits.forEach((cumStr, sIdx) => {
        const cumSec = timeToSeconds(cumStr);
        const subLapSec = isFinite(cumSec) ? cumSec - prevCumulativeSec : Infinity;
        if (isFinite(cumSec)) {
          prevCumulativeSec = cumSec;
        }
        legSubSplits.push({
          subIndex: sIdx + 1,
          subDistance: `${(sIdx + 1) * interval}y`,
          cumulative: cumStr,
          lap: isFinite(subLapSec) && subLapSec > 0 ? secondsToTime(subLapSec) : '-',
        });
      });
    }

    const legEndSec = prevCumulativeSec;
    const totalLegSec = legEndSec > legStartSec ? legEndSec - legStartSec : Infinity;
    const endCumulativeStr =
      leg.splits && leg.splits.length > 0 ? leg.splits[leg.splits.length - 1] : '-';

    return {
      ...leg,
      subSplits: legSubSplits,
      legTotalTime: isFinite(totalLegSec) ? secondsToTime(totalLegSec) : '-',
      endCumulativeTime: endCumulativeStr,
    };
  });
}

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  const [parsedData, setParsedData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Navigation & Filters
  const [activeSection, setActiveSection] = useState('home'); // 'home' | 'history' | 'records' | 'inmeet' | 'results' | 'postmeet'
  const [activeTab, setActiveTab] = useState('individual'); // 'individual' | 'relays' | 'roster' (inside 'results')
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState('ALL');
  const [selectedGender, setSelectedGender] = useState('ALL'); // 'ALL' | 'Men' | 'Women'
  const [multiWinTeamFilter, setMultiWinTeamFilter] = useState('ALL');
  const [multiWinGenderFilter, setMultiWinGenderFilter] = useState('ALL');
  const [sortConfig, setSortConfig] = useState({ key: 'eventNumber', direction: 'asc' });
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Historical Benchmarks & Analytics State (Persisted in localStorage)
  const [historicalRecords, setHistoricalRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('swimmeet_historical_records_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [seasonStartDate, setSeasonStartDate] = useState(() => {
    return localStorage.getItem('swimmeet_season_start_v1') || '2026-09-01';
  });
  const [primaryTeamCode, setPrimaryTeamCode] = useState(() => {
    return localStorage.getItem('swimmeet_primary_team_v1') || 'ALL';
  });
  const [countRelayLeadOffs, setCountRelayLeadOffs] = useState(true);
  const [pasteSheetText, setPasteSheetText] = useState('');
  const [stagedHistoryRows, setStagedHistoryRows] = useState([]);
  const [stagedFilter, setStagedFilter] = useState('all'); // 'all' | 'official' | 'splits' | 'duplicates'
  const [benchmarkStatusMsg, setBenchmarkStatusMsg] = useState('');
  const [copiedRecap, setCopiedRecap] = useState(false);
  const [includeSplitsOnCommit, setIncludeSplitsOnCommit] = useState(false);
  const [recordBookGender, setRecordBookGender] = useState('Women');
  const [recordBookEventKey, setRecordBookEventKey] = useState('');

  // Master Lists (Master Athlete Roster & Master Competitions) persisted in localStorage
  const [masterRoster, setMasterRoster] = useState(() => {
    try {
      const saved = localStorage.getItem('swimmeet_master_roster_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [masterCompetitions, setMasterCompetitions] = useState(() => {
    try {
      const saved = localStorage.getItem('swimmeet_master_competitions_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [historySubTab, setHistorySubTab] = useState('import'); // 'import' | 'roster' | 'competitions' | 'committed'
  const [rosterSearch, setRosterSearch] = useState('');
  const [rosterActiveOnly, setRosterActiveOnly] = useState(false);
  const [newAthleteName, setNewAthleteName] = useState('');
  const [newAthleteGender, setNewAthleteGender] = useState('Women');
  const [newAthleteActive, setNewAthleteActive] = useState(true);
  const [newCompName, setNewCompName] = useState('');
  const [newCompLocation, setNewCompLocation] = useState('');
  const [reconcileSelections, setReconcileSelections] = useState({}); // key -> targetMasterId or '__NEW__'

  const fileInputRef = useRef(null);
  const historyCsvInputRef = useRef(null);

  const updateMasterRoster = (next) => {
    setMasterRoster(next);
    try {
      localStorage.setItem('swimmeet_master_roster_v1', JSON.stringify(next));
    } catch {
      // Ignore storage quota errors
    }
  };

  const updateMasterCompetitions = (next) => {
    setMasterCompetitions(next);
    try {
      localStorage.setItem('swimmeet_master_competitions_v1', JSON.stringify(next));
    } catch {
      // Ignore storage quota errors
    }
  };

  // Resolve an incoming swimmer name against Master Roster (canonical name or aliases)
  const resolveMasterAthlete = (rawName, rosterList = masterRoster) => {
    const key = normalizeSwimmerKey(rawName);
    if (!key) return null;
    return (
      rosterList.find(
        (ath) =>
          normalizeSwimmerKey(ath.canonicalName) === key ||
          (ath.aliases || []).some((al) => normalizeSwimmerKey(al) === key)
      ) || null
    );
  };

  // Resolve an incoming competition string against Master Competitions (canonical name or aliases)
  const resolveMasterCompetition = (rawComp, compList = masterCompetitions) => {
    const key = String(rawComp || '').trim().toLowerCase();
    if (!key) return null;
    return (
      compList.find(
        (c) =>
          c.canonicalName.trim().toLowerCase() === key ||
          (c.aliases || []).some((al) => al.trim().toLowerCase() === key)
      ) || null
    );
  };

  // Re-evaluate staged rows against current Master Roster & Master Competitions
  const refreshStagedMatches = (
    rowsToCheck,
    rosterList = masterRoster,
    compList = masterCompetitions,
    dbRecords = historicalRecords
  ) => {
    const existingSigs = new Set(
      dbRecords.map(
        (h) => `${h.nameKey}|${h.eventKey}|${h.seconds.toFixed(2)}|${h.competition}`
      )
    );
    const seenInBatch = new Set();

    return rowsToCheck.map((row) => {
      const matchedAth = resolveMasterAthlete(row.rawImportedName || row.nameRaw, rosterList);
      const matchedComp = resolveMasterCompetition(
        row.rawImportedCompetition || row.competition,
        compList
      );
      const resolvedName = matchedAth ? matchedAth.canonicalName : row.nameRaw;
      const resolvedNameKey = normalizeSwimmerKey(resolvedName);
      const resolvedComp = matchedComp ? matchedComp.canonicalName : row.competition;
      const resolvedLoc =
        row.location || (matchedComp && matchedComp.defaultLocation ? matchedComp.defaultLocation : '');

      const sig = `${resolvedNameKey}|${row.eventKey}|${row.seconds.toFixed(2)}|${resolvedComp}`;
      const isDuplicate = existingSigs.has(sig) || seenInBatch.has(sig);
      seenInBatch.add(sig);

      return {
        ...row,
        rawImportedName: row.rawImportedName || row.nameRaw,
        rawImportedCompetition: row.rawImportedCompetition || row.competition,
        nameRaw: resolvedName,
        nameKey: resolvedNameKey,
        competition: resolvedComp,
        location: resolvedLoc,
        matchedAthleteId: matchedAth ? matchedAth.id : null,
        matchedAthleteActive: matchedAth ? matchedAth.isActive : null,
        matchedCompId: matchedComp ? matchedComp.id : null,
        isDuplicate,
      };
    });
  };

  // Save historical benchmarks helper
  const updateHistoricalRecords = (records) => {
    setHistoricalRecords(records);
    try {
      localStorage.setItem('swimmeet_historical_records_v1', JSON.stringify(records));
    } catch {
      // Ignore storage quota errors
    }
  };

  const handleSeasonStartChange = (val) => {
    setSeasonStartDate(val);
    try {
      localStorage.setItem('swimmeet_season_start_v1', val);
    } catch {
      // Ignore storage quota errors
    }
  };

  const handlePrimaryTeamChange = (val) => {
    setPrimaryTeamCode(val);
    try {
      localStorage.setItem('swimmeet_primary_team_v1', val);
    } catch {
      // Ignore storage quota errors
    }
  };

  const handleImportHistoryText = (rawText, mode = 'replace') => {
    const parsed = parseGoogleSheetHistory(rawText);
    if (parsed.length === 0) {
      setBenchmarkStatusMsg(
        'No valid rows found. Ensure columns follow: Name, Class, Event, Min, Sec, Date, Location, Competition, Place, Time, Event, Seconds.'
      );
      return;
    }
    const next = mode === 'append' ? [...historicalRecords, ...parsed] : parsed;
    updateHistoricalRecords(next);
    setBenchmarkStatusMsg(
      `Loaded ${parsed.length} historical performances (${next.length} total in database).`
    );
    setPasteSheetText('');
    setStagedHistoryRows([]);
  };

  // Stage pasted or uploaded Google Sheet rows for inspection & deduplication before committing
  const handleStageHistoryText = (rawText) => {
    const parsed = parseGoogleSheetHistory(rawText);
    if (parsed.length === 0) {
      setBenchmarkStatusMsg(
        'No valid rows found to stage. Verify columns: Name, Class, Event, Min, Sec, Date, Location, Competition, Place, Time, Event, Seconds.'
      );
      return;
    }

    const annotated = refreshStagedMatches(parsed).map((row) => ({
      ...row,
      selected: !row.isDuplicate,
    }));

    setStagedHistoryRows(annotated);
    setStagedFilter('all');
    setReconcileSelections({});
    const unmatchedAthCount = new Set(
      annotated.filter((r) => !r.matchedAthleteId).map((r) => r.rawImportedName)
    ).size;
    const unmatchedCompCount = new Set(
      annotated
        .filter((r) => r.rawImportedCompetition && !r.matchedCompId)
        .map((r) => r.rawImportedCompetition)
    ).size;

    setBenchmarkStatusMsg(
      `Staged ${annotated.length} rows (${annotated.filter((r) => r.isDuplicate).length} duplicates, ${unmatchedAthCount} unmatched athletes, ${unmatchedCompCount} unmatched competitions).`
    );
  };

  // Unmatched unique athletes & competitions currently in staging
  const stagedUnmatchedSummary = useMemo(() => {
    const athMap = new Map();
    const compMap = new Map();

    stagedHistoryRows.forEach((r) => {
      if (!r.matchedAthleteId && r.rawImportedName) {
        const k = normalizeSwimmerKey(r.rawImportedName);
        if (!athMap.has(k)) {
          const inferredGender = r.eventKey.startsWith('men ')
            ? 'Men'
            : r.eventKey.startsWith('women ')
            ? 'Women'
            : 'Women';
          athMap.set(k, {
            key: k,
            rawName: r.rawImportedName,
            inferredGender,
            count: 0,
          });
        }
        athMap.get(k).count += 1;
      }

      if (!r.matchedCompId && r.rawImportedCompetition) {
        const ck = r.rawImportedCompetition.trim().toLowerCase();
        if (!compMap.has(ck)) {
          compMap.set(ck, {
            key: ck,
            rawComp: r.rawImportedCompetition,
            sampleLocation: r.location || '',
            count: 0,
          });
        }
        compMap.get(ck).count += 1;
      }
    });

    return {
      athletes: Array.from(athMap.values()),
      competitions: Array.from(compMap.values()),
    };
  }, [stagedHistoryRows]);

  // Reconcile a single unmatched athlete (either map as alias to existing or create new)
  const handleReconcileAthlete = (item, targetSelection, activeFlag = true) => {
    let nextRoster = [...masterRoster];
    if (!targetSelection || targetSelection === '__NEW__') {
      const created = {
        id: `ath-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        canonicalName: item.rawName.trim(),
        gender: item.inferredGender || 'Women',
        isActive: activeFlag,
        aliases: [],
      };
      nextRoster.push(created);
    } else {
      nextRoster = nextRoster.map((ath) => {
        if (ath.id !== targetSelection) return ath;
        const existingAliases = ath.aliases || [];
        const alreadyHas = existingAliases.some(
          (a) => normalizeSwimmerKey(a) === normalizeSwimmerKey(item.rawName)
        );
        return {
          ...ath,
          aliases: alreadyHas ? existingAliases : [...existingAliases, item.rawName.trim()],
        };
      });
    }
    updateMasterRoster(nextRoster);
    setStagedHistoryRows((prev) =>
      refreshStagedMatches(prev, nextRoster, masterCompetitions, historicalRecords)
    );
  };

  // Reconcile a single unmatched competition (either map as alias or create new)
  const handleReconcileCompetition = (item, targetSelection) => {
    let nextComps = [...masterCompetitions];
    if (!targetSelection || targetSelection === '__NEW__') {
      const created = {
        id: `comp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        canonicalName: item.rawComp.trim(),
        defaultLocation: item.sampleLocation || '',
        aliases: [],
      };
      nextComps.push(created);
    } else {
      nextComps = nextComps.map((c) => {
        if (c.id !== targetSelection) return c;
        const existingAliases = c.aliases || [];
        const alreadyHas = existingAliases.some(
          (a) => a.trim().toLowerCase() === item.rawComp.trim().toLowerCase()
        );
        return {
          ...c,
          aliases: alreadyHas ? existingAliases : [...existingAliases, item.rawComp.trim()],
        };
      });
    }
    updateMasterCompetitions(nextComps);
    setStagedHistoryRows((prev) =>
      refreshStagedMatches(prev, masterRoster, nextComps, historicalRecords)
    );
  };

  // Bulk-create all remaining unmatched athletes & competitions in staging
  const handleAutoCreateAllUnmatched = (markAthletesActive = true) => {
    let nextRoster = [...masterRoster];
    stagedUnmatchedSummary.athletes.forEach((item) => {
      if (!resolveMasterAthlete(item.rawName, nextRoster)) {
        nextRoster.push({
          id: `ath-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          canonicalName: item.rawName.trim(),
          gender: item.inferredGender || 'Women',
          isActive: markAthletesActive,
          aliases: [],
        });
      }
    });

    let nextComps = [...masterCompetitions];
    stagedUnmatchedSummary.competitions.forEach((item) => {
      if (!resolveMasterCompetition(item.rawComp, nextComps)) {
        nextComps.push({
          id: `comp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          canonicalName: item.rawComp.trim(),
          defaultLocation: item.sampleLocation || '',
          aliases: [],
        });
      }
    });

    updateMasterRoster(nextRoster);
    updateMasterCompetitions(nextComps);
    setStagedHistoryRows((prev) =>
      refreshStagedMatches(prev, nextRoster, nextComps, historicalRecords)
    );
    setBenchmarkStatusMsg(
      `Created ${stagedUnmatchedSummary.athletes.length} roster entries & ${stagedUnmatchedSummary.competitions.length} competitions.`
    );
  };

  // Seed Master Roster & Master Competitions from already-committed historical records
  const handleSyncMasterListsFromDatabase = () => {
    let nextRoster = [...masterRoster];
    let addedAthletes = 0;
    let nextComps = [...masterCompetitions];
    let addedComps = 0;

    historicalRecords.forEach((h) => {
      if (h.nameRaw && !resolveMasterAthlete(h.nameRaw, nextRoster)) {
        const g = h.eventKey?.startsWith('men ') ? 'Men' : 'Women';
        nextRoster.push({
          id: `ath-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          canonicalName: h.nameRaw.trim(),
          gender: g,
          isActive: true,
          aliases: [],
        });
        addedAthletes++;
      }
      if (h.competition && !resolveMasterCompetition(h.competition, nextComps)) {
        nextComps.push({
          id: `comp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          canonicalName: h.competition.trim(),
          defaultLocation: h.location || '',
          aliases: [],
        });
        addedComps++;
      }
    });

    updateMasterRoster(nextRoster);
    updateMasterCompetitions(nextComps);
    setBenchmarkStatusMsg(
      `Synced Master Lists from database: added ${addedAthletes} athletes and ${addedComps} competitions.`
    );
  };

  const handleCommitStagedRows = (mode = 'append') => {
    const chosen = stagedHistoryRows
      .filter((r) => r.selected)
      .map(({ isDuplicate, selected, ...cleanRow }) => cleanRow);

    if (chosen.length === 0) {
      setBenchmarkStatusMsg('No rows selected in staging table to commit.');
      return;
    }

    const next = mode === 'replace' ? chosen : [...historicalRecords, ...chosen];
    updateHistoricalRecords(next);
    setBenchmarkStatusMsg(
      `Committed ${chosen.length} verified performances (${next.length} total in database).`
    );
    setStagedHistoryRows([]);
    setPasteSheetText('');
  };

  const handleHistoryCsvUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPasteSheetText(e.target.result);
      handleStageHistoryText(e.target.result);
    };
    reader.readAsText(file);
  };

  const handleDownloadSampleSheetCSV = () => {
    const blob = new Blob(['\uFEFF' + SAMPLE_GOOGLE_SHEET_CSV], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'swim_history_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Export entire master historical database in exact 12-column Google Sheet CSV format
  const handleExportMasterHistoryCSV = () => {
    if (historicalRecords.length === 0) return;
    const headers = [
      'Name',
      'Class',
      'Event',
      'Min',
      'Sec',
      'Date',
      'Location',
      'Competition',
      'Place',
      'Time',
      'Event',
      'Seconds',
    ];

    const rows = historicalRecords.map((h) => {
      const mins = Math.floor((h.seconds || 0) / 60);
      const secs = ((h.seconds || 0) % 60).toFixed(2);
      const shortEv = h.eventRaw
        .replace(/^(Women|Men|Mixed)\s+/i, '')
        .replace(/Freestyle/i, 'Free')
        .replace(/Backstroke/i, 'Back')
        .replace(/Breaststroke/i, 'Breast')
        .replace(/Butterfly/i, 'Fly')
        .replace(/Individual Medley/i, 'IM');

      return [
        h.nameRaw,
        h.classYear || '',
        shortEv,
        mins,
        secs,
        h.date || '',
        h.location || '',
        h.competition || '',
        h.place || '',
        h.time,
        h.eventRaw,
        (h.seconds || 0).toFixed(2),
      ];
    });

    const csvString = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
      )
      .join('\r\n');

    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'master_swim_database.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Commit current meet's performances into the historical benchmark database
  const handleCommitMeetToDatabase = () => {
    if (!parsedData) return;

    if (primaryTeamCode === 'ALL') {
      setBenchmarkStatusMsg(
        'Please select a specific team (e.g., Gettysburg College) in Primary Team Filter before committing results to the database.'
      );
      return;
    }

    const meetLocation = [parsedData.meetInfo.city, parsedData.meetInfo.state]
      .filter(Boolean)
      .join(' ');
    const rawMeetComp = parsedData.meetInfo.name || 'Swim Meet';
    const matchedMasterComp = resolveMasterCompetition(rawMeetComp);
    const meetComp = matchedMasterComp ? matchedMasterComp.canonicalName : rawMeetComp;
    const meetDateRaw = parsedData.meetInfo.startDate || new Date().toISOString().slice(0, 10);
    const meetDateParsed = parseFlexibleDate(meetDateRaw);
    const isoDateStr = meetDateParsed
      ? `${meetDateParsed.getFullYear()}-${String(meetDateParsed.getMonth() + 1).padStart(2, '0')}-${String(
          meetDateParsed.getDate()
        ).padStart(2, '0')}`
      : meetDateRaw;

    // Build signature set of existing records to prevent duplicate commits of the same meet
    const existingSigs = new Set(
      historicalRecords.map(
        (h) => `${h.nameKey}|${h.eventKey}|${h.seconds.toFixed(2)}|${h.competition}`
      )
    );

    const newEntries = [];
    let skippedCount = 0;

    const addCandidate = ({
      swimmerDisplay,
      classYear,
      eventCanonical,
      timeStr,
      timeSec,
      placeVal,
      isOfficial,
    }) => {
      if (!isFinite(timeSec) || timeSec <= 0) return;
      const evKey = normalizeEventKey(eventCanonical);
      const matchedMasterAth = resolveMasterAthlete(swimmerDisplay);
      const resolvedDisplay = matchedMasterAth
        ? matchedMasterAth.canonicalName
        : swimmerDisplay;
      const nmKey = normalizeSwimmerKey(resolvedDisplay);
      if (!evKey || !nmKey) return;

      const sig = `${nmKey}|${evKey}|${timeSec.toFixed(2)}|${meetComp}`;
      if (existingSigs.has(sig)) {
        skippedCount++;
        return;
      }
      existingSigs.add(sig);

      newEntries.push({
        id: `commit-${Date.now()}-${newEntries.length}-${nmKey}`,
        source: 'meet',
        eventRaw: eventCanonical,
        eventKey: evKey,
        nameRaw: resolvedDisplay,
        nameKey: nmKey,
        classYear: classYear || '',
        time: timeStr || secondsToTime(timeSec),
        seconds: timeSec,
        date: isoDateStr,
        dateObj: meetDateParsed,
        place: placeVal,
        location: meetLocation,
        competition: meetComp,
        isOfficial,
      });
    };

    // 1. Individual Swims (filtered to primaryTeamCode if set)
    parsedData.individualResults.forEach((r) => {
      if (primaryTeamCode !== 'ALL' && r.teamCode !== primaryTeamCode) return;
      const swimmerDisplay = formatSwimmerDisplay(r.swimmerName, r.preferredFirst);

      addCandidate({
        swimmerDisplay,
        classYear: r.classYear,
        eventCanonical: r.eventLabel,
        timeStr: r.finalsTime,
        timeSec: r.timeSeconds,
        placeVal: r.place ?? '',
        isOfficial: true,
      });

      // Optional mid-race opening split (e.g., 1000 Free split inside 1650 Free -> Place = 'S')
      if (
        includeSplitsOnCommit &&
        r.distance === 1650 &&
        r.strokeCode === '1' &&
        r.splits &&
        r.splits.length >= 20
      ) {
        const split1000Str = r.splits[19];
        const split1000Sec = timeToSeconds(split1000Str);
        if (isFinite(split1000Sec)) {
          addCandidate({
            swimmerDisplay,
            classYear: r.classYear,
            eventCanonical: `${r.genderLabel} 1000 Freestyle`,
            timeStr: split1000Str,
            timeSec: split1000Sec,
            placeVal: 'S',
            isOfficial: false,
          });
        }
      }
    });

    // 2. Relay Lead-Offs (Leg 1 Official) & Optional Flying Legs 2–4 (Place = 'R')
    parsedData.relayResults.forEach((rel) => {
      if (primaryTeamCode !== 'ALL' && rel.teamCode !== primaryTeamCode) return;
      const relayDist = parseInt(rel.distance, 10);
      if (!relayDist || relayDist % 4 !== 0) return;
      const legDist = relayDist / 4;

      const legBreakdown = calculateRelayLegBreakdown(rel);
      legBreakdown.forEach((leg) => {
        if (!leg.legTotalTime || leg.legTotalTime === '-') return;
        const legSec = timeToSeconds(leg.legTotalTime);
        if (!isFinite(legSec)) return;

        const swimmerDisplay = formatSwimmerDisplay(leg.swimmerName, leg.preferredFirst);

        if (leg.legOrder === 1 && countRelayLeadOffs) {
          const leadStroke =
            rel.strokeCode === '7'
              ? 'Backstroke'
              : rel.strokeCode === '6'
              ? 'Freestyle'
              : null;
          if (leadStroke) {
            addCandidate({
              swimmerDisplay,
              classYear: leg.classYear,
              eventCanonical: `${rel.genderLabel} ${legDist} ${leadStroke}`,
              timeStr: leg.legTotalTime,
              timeSec: legSec,
              placeVal: '1',
              isOfficial: true,
            });
          }
        } else if (includeSplitsOnCommit && leg.legOrder > 1) {
          // Flying relay splits (Legs 2-4) marked with Place = 'R' and isOfficial = false
          const medleyStrokes = { 2: 'Breaststroke', 3: 'Butterfly', 4: 'Freestyle' };
          const splitStroke =
            rel.strokeCode === '7'
              ? medleyStrokes[leg.legOrder]
              : rel.strokeCode === '6'
              ? 'Freestyle'
              : null;
          if (splitStroke) {
            addCandidate({
              swimmerDisplay,
              classYear: leg.classYear,
              eventCanonical: `${rel.genderLabel} ${legDist} ${splitStroke}`,
              timeStr: leg.legTotalTime,
              timeSec: legSec,
              placeVal: 'R',
              isOfficial: false,
            });
          }
        }
      });
    });

    if (newEntries.length === 0) {
      setBenchmarkStatusMsg(
        skippedCount > 0
          ? `Meet already committed (${skippedCount} matching performances already in database).`
          : 'No eligible performances found for the selected primary team.'
      );
      return;
    }

    const updated = [...historicalRecords, ...newEntries];
    updateHistoricalRecords(updated);
    setBenchmarkStatusMsg(
      `Committed ${newEntries.length} new performances from "${meetComp}" to database (${updated.length} total records).`
    );
  };

  // Core CL2 / SD3 text processor used by both file uploads and sample meet loader
  const handleProcessText = (rawContent, uploadedFileName = '') => {
    try {
      setErrorMsg('');
      const data = parseSDIFContent(rawContent);
      setParsedData(data);
      setFileName(uploadedFileName);
      setSelectedTeam('ALL');
      setSelectedEvent('ALL');
      setSelectedGender('ALL');
      setExpandedRows(new Set());
      setActiveSection('results');
      setActiveTab('individual');

      // Auto-select Gettysburg (or matching saved primary team) so commits & record checks target your program automatically
      if (data.teams && data.teams.length > 0) {
        const hasCurrent = data.teams.some((t) => t.code === primaryTeamCode);
        if (!hasCurrent) {
          const gettysburgTeam = data.teams.find(
            (t) =>
              t.name.toLowerCase().includes('gettysburg') ||
              t.code.toLowerCase().includes('gett')
          );
          if (gettysburgTeam) {
            handlePrimaryTeamChange(gettysburgTeam.code);
          } else if (data.teams.length === 1) {
            handlePrimaryTeamChange(data.teams[0].code);
          }
        }
      }
    } catch (err) {
      setErrorMsg(err?.message || 'An unexpected error occurred while parsing the SDIF file.');
    }
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    const validExt = /\.(cl2|sd3|txt)$/i;
    if (!validExt.test(file.name)) {
      setErrorMsg('Please upload a valid .cl2, .sd3, or .txt Hy-Tek results file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      handleProcessText(e.target.result, file.name);
    };
    reader.onerror = () => {
      setErrorMsg('Error reading the selected file.');
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    handleProcessText(SAMPLE_CL2_DATA, 'Meet Results-Gettysburg v Carnegie Mellon-07Nov2026-001.cl2');
  };

  // Drag-and-Drop Handlers
  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Toggle Row Expansion for Splits / Relay Legs
  const toggleRow = (id) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Sort Handler
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Unique Events Dropdown Options based on active tab
  const availableEvents = useMemo(() => {
    if (!parsedData) return [];
    const list = activeTab === 'relays' ? parsedData.relayResults : parsedData.individualResults;
    const map = new Map();
    list.forEach((item) => {
      if (!map.has(item.eventLabel)) {
        map.set(item.eventLabel, item.eventNumber);
      }
    });
    return Array.from(map.entries())
      .sort((a, b) => a[1] - b[1])
      .map(([label, num]) => ({ label, num }));
  }, [parsedData, activeTab]);

  // Filtered & Sorted Individual Results
  const filteredIndividuals = useMemo(() => {
    if (!parsedData) return [];
    return parsedData.individualResults
      .filter((row) => {
        if (selectedTeam !== 'ALL' && row.teamCode !== selectedTeam) return false;
        if (selectedGender !== 'ALL' && row.genderLabel !== selectedGender) return false;
        if (selectedEvent !== 'ALL' && row.eventLabel !== selectedEvent) return false;
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const fullText = `${row.swimmerName} ${row.preferredFirst} ${row.teamName} ${row.eventLabel}`.toLowerCase();
          if (!fullText.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const dir = sortConfig.direction === 'asc' ? 1 : -1;
        switch (sortConfig.key) {
          case 'eventNumber':
            if (a.eventNumber !== b.eventNumber) return (a.eventNumber - b.eventNumber) * dir;
            return a.timeSeconds - b.timeSeconds;
          case 'swimmerName':
            return a.swimmerName.localeCompare(b.swimmerName) * dir;
          case 'teamName':
            return a.teamName.localeCompare(b.teamName) * dir;
          case 'time':
            return (a.timeSeconds - b.timeSeconds) * dir;
          case 'place': {
            const pA = a.place ?? 9999;
            const pB = b.place ?? 9999;
            return (pA - pB) * dir;
          }
          default:
            return 0;
        }
      });
  }, [parsedData, selectedTeam, selectedGender, selectedEvent, searchQuery, sortConfig]);

  // Group Filtered Individual Results by Event for Event-Card Layout
  const groupedIndividualEvents = useMemo(() => {
    const groupsMap = new Map();

    filteredIndividuals.forEach((row) => {
      const key = `${row.eventNumber}-${row.eventLabel}`;
      if (!groupsMap.has(key)) {
        groupsMap.set(key, {
          key,
          eventNumber: row.eventNumber,
          eventLabel: row.eventLabel,
          course: row.course,
          swims: [],
        });
      }
      groupsMap.get(key).swims.push(row);
    });

    const groups = Array.from(groupsMap.values());

    // Sort event cards by event number (respecting sort direction when sorting by eventNumber)
    groups.sort((a, b) => {
      const dir = sortConfig.key === 'eventNumber' && sortConfig.direction === 'desc' ? -1 : 1;
      return (a.eventNumber - b.eventNumber) * dir;
    });

    // Within each event card, sort swimmers by place/time and compute time behind leader
    groups.forEach((group) => {
      group.swims.sort((a, b) => {
        const dir = sortConfig.direction === 'asc' ? 1 : -1;
        if (sortConfig.key === 'swimmerName') {
          return a.swimmerName.localeCompare(b.swimmerName) * dir;
        }
        if (sortConfig.key === 'teamName') {
          return a.teamName.localeCompare(b.teamName) * dir;
        }
        if (sortConfig.key === 'time') {
          return (a.timeSeconds - b.timeSeconds) * dir;
        }
        if (sortConfig.key === 'place') {
          const pA = a.place ?? 9999;
          const pB = b.place ?? 9999;
          return (pA - pB) * dir;
        }
        // Default: rank by place first, then fastest time
        const pA = a.place ?? 9999;
        const pB = b.place ?? 9999;
        if (pA !== pB) return pA - pB;
        return a.timeSeconds - b.timeSeconds;
      });

      const validTimes = group.swims.map((r) => r.timeSeconds).filter((t) => isFinite(t));
      group.fastestTimeSec = validTimes.length > 0 ? Math.min(...validTimes) : Infinity;
    });

    return groups;
  }, [filteredIndividuals, sortConfig]);

  // Expand or collapse all individual swims with splits inside a single event card
  const toggleAllIndividualsInEvent = (swimsInEvent) => {
    const expandableIds = swimsInEvent
      .filter((r) => r.splits && r.splits.length > 0)
      .map((r) => r.id);
    if (expandableIds.length === 0) return;

    const allExpanded = expandableIds.every((id) => expandedRows.has(id));
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (allExpanded) {
        expandableIds.forEach((id) => next.delete(id));
      } else {
        expandableIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  // Filtered Relay Results
  const filteredRelays = useMemo(() => {
    if (!parsedData) return [];
    return parsedData.relayResults.filter((row) => {
      if (selectedTeam !== 'ALL' && row.teamCode !== selectedTeam) return false;
      if (selectedGender !== 'ALL' && row.genderLabel !== selectedGender) return false;
      if (selectedEvent !== 'ALL' && row.eventLabel !== selectedEvent) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const legsText = row.legs.map((l) => `${l.swimmerName} ${l.preferredFirst}`).join(' ');
        const fullText = `${row.relayTitle} ${row.teamName} ${row.eventLabel} ${legsText}`.toLowerCase();
        if (!fullText.includes(q)) return false;
      }
      return true;
    });
  }, [parsedData, selectedTeam, selectedGender, selectedEvent, searchQuery]);

  // Group Filtered Relays by Event for Event-Card Layout
  const groupedRelayEvents = useMemo(() => {
    const groupsMap = new Map();

    filteredRelays.forEach((relay) => {
      const key = `${relay.eventNumber}-${relay.eventLabel}`;
      if (!groupsMap.has(key)) {
        groupsMap.set(key, {
          key,
          eventNumber: relay.eventNumber,
          eventLabel: relay.eventLabel,
          course: relay.course,
          relays: [],
        });
      }
      groupsMap.get(key).relays.push(relay);
    });

    const groups = Array.from(groupsMap.values());

    // Sort event cards by event number (respecting sort direction if sorting by eventNumber)
    groups.sort((a, b) => {
      const dir = sortConfig.key === 'eventNumber' && sortConfig.direction === 'desc' ? -1 : 1;
      return (a.eventNumber - b.eventNumber) * dir;
    });

    // Within each event card, sort squads by place/time and compute time behind leader
    groups.forEach((group) => {
      group.relays.sort((a, b) => {
        if (sortConfig.key === 'swimmerName') {
          const dir = sortConfig.direction === 'asc' ? 1 : -1;
          return a.relayTitle.localeCompare(b.relayTitle) * dir;
        }
        if (sortConfig.key === 'time') {
          const dir = sortConfig.direction === 'asc' ? 1 : -1;
          return (a.timeSeconds - b.timeSeconds) * dir;
        }
        if (sortConfig.key === 'place') {
          const dir = sortConfig.direction === 'asc' ? 1 : -1;
          const pA = a.place ?? 9999;
          const pB = b.place ?? 9999;
          return (pA - pB) * dir;
        }
        // Default: rank by place first, then fastest time
        const pA = a.place ?? 9999;
        const pB = b.place ?? 9999;
        if (pA !== pB) return pA - pB;
        return a.timeSeconds - b.timeSeconds;
      });

      const validTimes = group.relays.map((r) => r.timeSeconds).filter((t) => isFinite(t));
      group.fastestTimeSec = validTimes.length > 0 ? Math.min(...validTimes) : Infinity;
    });

    return groups;
  }, [filteredRelays, sortConfig]);

  // Expand or collapse all relay squads inside a single event card
  const toggleAllRelaysInEvent = (relaysInEvent) => {
    const expandableIds = relaysInEvent
      .filter((r) => r.legs.length > 0 || r.splits.length > 0)
      .map((r) => r.id);
    if (expandableIds.length === 0) return;

    const allExpanded = expandableIds.every((id) => expandedRows.has(id));
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (allExpanded) {
        expandableIds.forEach((id) => next.delete(id));
      } else {
        expandableIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  // Filtered Team Roster
  const filteredTeams = useMemo(() => {
    if (!parsedData) return [];
    return parsedData.teams
      .filter((t) => selectedTeam === 'ALL' || t.code === selectedTeam)
      .map((team) => ({
        ...team,
        swimmerList: team.swimmerList.filter((s) => {
          if (selectedGender !== 'ALL' && s.gender !== selectedGender) return false;
          if (searchQuery.trim() !== '') {
            const q = searchQuery.toLowerCase();
            if (!`${s.name} ${s.preferredFirst}`.toLowerCase().includes(q)) return false;
          }
          return true;
        }),
      }));
  }, [parsedData, selectedTeam, selectedGender, searchQuery]);

  // ============================================================================
  // HISTORICAL BENCHMARK ENGINE (PB, SB, ALL-TIME TOP 10 & FRESHMAN RECORDS)
  // ============================================================================
  const benchmarkAnalysis = useMemo(() => {
    const empty = {
      bySwimId: new Map(), // swimId -> { isPB, isSB, pbDelta, sbDelta, prevPB, prevSB, allTimeRank, bumpedSwimmer, isFreshmanRecord, prevFreshmanRecord }
      leadOffChecks: [], // Official Leg 1 flat-start evaluations
      milestones: [], // All PB / SB / Top-10 / Freshman Record achieved in this meet
      top10ByEvent: new Map(),
    };
    if (!parsedData || historicalRecords.length === 0) return empty;

    const seasonStart = parseFlexibleDate(seasonStartDate) || new Date(2026, 8, 1);
    const currentMeetDate = parseFlexibleDate(parsedData.meetInfo.startDate) || new Date();

    // Map swimmer nameKey -> gender ('women' | 'men') from current meet roster so genderless Sheet rows still match
    const swimmerGenderHint = new Map();
    parsedData.teams.forEach((t) => {
      t.swimmerList.forEach((sw) => {
        const g = (sw.gender || '').toLowerCase();
        if (g === 'women' || g === 'men') {
          const legalK = normalizeSwimmerKey(sw.name);
          const dispK = normalizeSwimmerKey(formatSwimmerDisplay(sw.name, sw.preferredFirst));
          if (legalK) swimmerGenderHint.set(legalK, g);
          if (dispK) swimmerGenderHint.set(dispK, g);
        }
      });
    });

    // Index historical records by resolved eventKey and by (swimmerKey|eventKey)
    const histByEvent = new Map();
    const histBySwimmerEvent = new Map();

    historicalRecords.forEach((h) => {
      if (!isFinite(h.seconds)) return;
      // Exclude relay/mid-race split rows ('R' / 'S') from official PB/SB/Top-10/FR checks
      if (h.isOfficial === false) return;

      let resolvedEvKey = h.eventKey;
      // If eventKey had no gender prefix (e.g. "100 freestyle"), infer from swimmer roster if available
      if (resolvedEvKey && !/^(women|men|mixed)\s/.test(resolvedEvKey)) {
        const inferredG = swimmerGenderHint.get(h.nameKey);
        if (inferredG) {
          resolvedEvKey = `${inferredG} ${resolvedEvKey}`;
        }
      }
      if (!resolvedEvKey) return;

      const normalizedHist =
        resolvedEvKey === h.eventKey ? h : { ...h, eventKey: resolvedEvKey };

      if (!histByEvent.has(resolvedEvKey)) histByEvent.set(resolvedEvKey, []);
      histByEvent.get(resolvedEvKey).push(normalizedHist);

      const sk = `${h.nameKey}|${resolvedEvKey}`;
      if (!histBySwimmerEvent.has(sk)) histBySwimmerEvent.set(sk, []);
      histBySwimmerEvent.get(sk).push(normalizedHist);
    });

    // Helper to evaluate a single official flat-start performance against historical baseline
    const evaluateOfficialSwim = ({
      id,
      teamCode,
      teamName,
      swimmerName,
      preferredFirst,
      classYear,
      eventLabel,
      eventKey,
      timeStr,
      timeSec,
      sourceType, // 'Individual' | 'Relay Lead-Off'
    }) => {
      if (!isFinite(timeSec) || timeSec <= 0 || !eventKey) return null;
      if (primaryTeamCode !== 'ALL' && teamCode !== primaryTeamCode) return null;

      // Match against both legal name ("Kaitlin Hall") and nickname ("Kait Hall")
      const legalKey = normalizeSwimmerKey(swimmerName);
      const displayKey = normalizeSwimmerKey(formatSwimmerDisplay(swimmerName, preferredFirst));
      const candidateKeys = Array.from(new Set([legalKey, displayKey].filter(Boolean)));

      const swimmerHist = [];
      candidateKeys.forEach((nk) => {
        const rows = histBySwimmerEvent.get(`${nk}|${eventKey}`);
        if (rows) swimmerHist.push(...rows);
      });

      // Deduplicate by id
      const uniqueSwimmerHist = Array.from(
        new Map(swimmerHist.map((item) => [item.id, item])).values()
      );

      let prevPB = null;
      let prevSB = null;

      uniqueSwimmerHist.forEach((h) => {
        // Exclude exact same meet date if re-importing the same meet
        const isSameDate =
          h.dateObj &&
          currentMeetDate &&
          h.dateObj.toDateString() === currentMeetDate.toDateString() &&
          Math.abs(h.seconds - timeSec) < 0.005;
        if (isSameDate) return;

        if (!prevPB || h.seconds < prevPB.seconds) {
          prevPB = h;
        }
        if (h.dateObj && h.dateObj >= seasonStart) {
          if (!prevSB || h.seconds < prevSB.seconds) {
            prevSB = h;
          }
        }
      });

      const isPB = prevPB ? timeSec < prevPB.seconds - 0.001 : false;
      const isSB = prevSB ? timeSec < prevSB.seconds - 0.001 : false;
      const pbDelta = prevPB ? timeSec - prevPB.seconds : null;
      const sbDelta = prevSB ? timeSec - prevSB.seconds : null;

      // Program All-Time Top 10 & Freshman Record Check
      const eventPool = histByEvent.get(eventKey) || [];
      let allTimeRank = null;
      let bumpedSwimmer = null;
      let isFreshmanRecord = false;
      let prevFreshmanRecord = null;

      if (eventPool.length > 0) {
        // 1. All-Time Top 10 (best time per unique athlete)
        const bestByAthlete = new Map();
        eventPool.forEach((h) => {
          const existing = bestByAthlete.get(h.nameKey);
          if (!existing || h.seconds < existing.seconds) {
            bestByAthlete.set(h.nameKey, h);
          }
        });

        // Remove current athlete's older mark so they don't rank against themselves
        candidateKeys.forEach((nk) => bestByAthlete.delete(nk));

        const sortedProgram = Array.from(bestByAthlete.values()).sort(
          (a, b) => a.seconds - b.seconds
        );
        const fasterCount = sortedProgram.filter((entry) => entry.seconds <= timeSec + 0.001)
          .length;
        const rank = fasterCount + 1;

        if (rank <= 10) {
          allTimeRank = rank;
          if (sortedProgram[rank - 1]) {
            bumpedSwimmer = sortedProgram[rank - 1];
          }
        }

        // 2. Freshman Program Record Check (when athlete's classYear === 'FR')
        if (classYear === 'FR') {
          const freshmanSwims = eventPool.filter((h) => {
            if (h.classYear !== 'FR') return false;
            // Exclude exact same meet date if re-importing
            const isSameDate =
              h.dateObj &&
              currentMeetDate &&
              h.dateObj.toDateString() === currentMeetDate.toDateString() &&
              Math.abs(h.seconds - timeSec) < 0.005;
            return !isSameDate;
          });

          if (freshmanSwims.length > 0) {
            freshmanSwims.sort((a, b) => a.seconds - b.seconds);
            prevFreshmanRecord = freshmanSwims[0];
            if (timeSec < prevFreshmanRecord.seconds - 0.001) {
              isFreshmanRecord = true;
            }
          }
        }
      }

      const result = {
        id,
        teamCode,
        teamName,
        swimmerDisplay: formatSwimmerDisplay(swimmerName, preferredFirst),
        classYear,
        eventLabel,
        eventKey,
        timeStr,
        timeSec,
        sourceType,
        isPB,
        isSB,
        pbDelta,
        sbDelta,
        prevPB,
        prevSB,
        allTimeRank,
        bumpedSwimmer,
        isFreshmanRecord,
        prevFreshmanRecord,
      };

      if (isPB || isSB || allTimeRank || isFreshmanRecord) {
        empty.milestones.push(result);
      }
      return result;
    };

    // 1. Evaluate all official Individual (D0) swims
    parsedData.individualResults.forEach((r) => {
      const evKey = normalizeEventKey(r.eventLabel, r.genderLabel);
      const evalRes = evaluateOfficialSwim({
        id: r.id,
        teamCode: r.teamCode,
        teamName: r.teamName,
        swimmerName: r.swimmerName,
        preferredFirst: r.preferredFirst,
        classYear: r.classYear,
        eventLabel: r.eventLabel,
        eventKey: evKey,
        timeStr: r.finalsTime,
        timeSec: r.timeSeconds,
        sourceType: 'Individual',
      });
      if (evalRes) {
        empty.bySwimId.set(r.id, evalRes);
      }
    });

    // 2. Evaluate Official Flat-Start Relay Lead-Offs (Leg 1 ONLY; Legs 2-4 strictly excluded!)
    if (countRelayLeadOffs) {
      parsedData.relayResults.forEach((rel) => {
        const leg1 = rel.legs.find((l) => l.legOrder === 1);
        if (!leg1 || !leg1.splits || leg1.splits.length === 0) return;

        // Leg 1 distance is total relay distance / 4 (e.g., 400 Medley -> 100 Backstroke; 200 Free -> 50 Freestyle)
        const relayDist = parseInt(rel.distance, 10);
        if (!relayDist || relayDist % 4 !== 0) return;
        const legDist = relayDist / 4;

        // Medley Relay Leg 1 is ALWAYS Backstroke; Freestyle Relay Leg 1 is ALWAYS Freestyle
        const leadStroke =
          rel.strokeCode === '7'
            ? 'Backstroke'
            : rel.strokeCode === '6'
            ? 'Freestyle'
            : null;
        if (!leadStroke) return;

        const leadTimeStr = leg1.splits[leg1.splits.length - 1];
        const leadTimeSec = timeToSeconds(leadTimeStr);
        const leadEventLabel = `${rel.genderLabel} ${legDist} ${leadStroke}`;
        const leadEventKey = normalizeEventKey(leadEventLabel, rel.genderLabel);

        const evalRes = evaluateOfficialSwim({
          id: `${rel.id}-leadoff`,
          teamCode: rel.teamCode,
          teamName: rel.teamName,
          swimmerName: leg1.swimmerName,
          preferredFirst: leg1.preferredFirst,
          classYear: leg1.classYear,
          eventLabel: `${leadEventLabel} (Relay Lead-Off)`,
          eventKey: leadEventKey,
          timeStr: leadTimeStr,
          timeSec: leadTimeSec,
          sourceType: 'Relay Lead-Off',
        });

        if (evalRes) {
          empty.bySwimId.set(`${rel.id}-leadoff`, evalRes);
          empty.leadOffChecks.push(evalRes);
        }
      });
    }

    return empty;
  }, [parsedData, historicalRecords, seasonStartDate, primaryTeamCode, countRelayLeadOffs]);

  // ============================================================================
  // LIVE PROGRAM ALL-TIME TOP-10 & FRESHMAN RECORD BOOK COMPUTATION
  // ============================================================================
  const recordBookData = useMemo(() => {
    const eventsMap = new Map();

    // Build swimmer gender lookup from current meet if any historical entries omitted gender
    const swimmerGenderHint = new Map();
    if (parsedData) {
      parsedData.teams.forEach((t) => {
        t.swimmerList.forEach((sw) => {
          const g = (sw.gender || '').toLowerCase();
          if (g === 'women' || g === 'men') {
            const legalK = normalizeSwimmerKey(sw.name);
            const dispK = normalizeSwimmerKey(formatSwimmerDisplay(sw.name, sw.preferredFirst));
            if (legalK) swimmerGenderHint.set(legalK, g);
            if (dispK) swimmerGenderHint.set(dispK, g);
          }
        });
      });
    }

    historicalRecords.forEach((h) => {
      if (!isFinite(h.seconds) || h.isOfficial === false) return;
      let evKey = h.eventKey || normalizeEventKey(h.eventRaw);
      if (evKey && !/^(women|men|mixed)\s/.test(evKey)) {
        const inferredG = swimmerGenderHint.get(h.nameKey);
        if (inferredG) evKey = `${inferredG} ${evKey}`;
      }
      if (!evKey) return;

      const gender = evKey.startsWith('women ')
        ? 'Women'
        : evKey.startsWith('men ')
        ? 'Men'
        : 'Other';
      if (gender !== recordBookGender) return;

      if (!eventsMap.has(evKey)) {
        const label = evKey
          .split(' ')
          .map((w) => (w === 'im' ? 'IM' : w.charAt(0).toUpperCase() + w.slice(1)))
          .join(' ');
        eventsMap.set(evKey, {
          eventKey: evKey,
          label,
          entries: [],
        });
      }
      eventsMap.get(evKey).entries.push({ ...h, eventKey: evKey });
    });

    const eventList = Array.from(eventsMap.values()).sort((a, b) =>
      a.label.localeCompare(b.label)
    );

    const activeKey =
      recordBookEventKey && eventsMap.has(recordBookEventKey)
        ? recordBookEventKey
        : eventList[0]?.eventKey || '';

    const activeGroup = activeKey ? eventsMap.get(activeKey) : null;
    if (!activeGroup) {
      return { eventList, activeKey: '', top10: [], freshmanRecord: null, historicalCount: 0, meetCount: 0 };
    }

    // Best official time per unique athlete for Top-10 across BOTH imported Sheet rows and committed meets
    const bestByAthlete = new Map();
    activeGroup.entries.forEach((entry) => {
      const existing = bestByAthlete.get(entry.nameKey);
      if (!existing || entry.seconds < existing.seconds) {
        bestByAthlete.set(entry.nameKey, entry);
      }
    });

    const top10 = Array.from(bestByAthlete.values())
      .sort((a, b) => a.seconds - b.seconds)
      .slice(0, 10);

    // Fastest Freshman ('FR') official time across entire database
    const frEntries = activeGroup.entries
      .filter((e) => e.classYear === 'FR')
      .sort((a, b) => a.seconds - b.seconds);

    const historicalCount = activeGroup.entries.filter((e) => e.source !== 'meet').length;
    const meetCount = activeGroup.entries.filter((e) => e.source === 'meet').length;

    return {
      eventList,
      activeKey,
      top10,
      freshmanRecord: frEntries[0] || null,
      historicalCount,
      meetCount,
    };
  }, [historicalRecords, recordBookGender, recordBookEventKey, parsedData]);

  // ============================================================================
  // WIN-TRACKING & MULTI-WIN ATHLETES COMPUTATION
  // ============================================================================
  const winSummary = useMemo(() => {
    if (!parsedData) {
      return {
        teamWins: [],
        multiWinAthletes: [],
        allWinners: [],
        totalEventsWon: 0,
      };
    }

    const teamWinsMap = new Map();
    const ensureTeam = (code, name) => {
      if (!teamWinsMap.has(code)) {
        teamWinsMap.set(code, {
          code,
          name: name || code,
          individualWins: 0,
          relayWins: 0,
          womenWins: 0,
          menWins: 0,
          totalWins: 0,
        });
      }
      return teamWinsMap.get(code);
    };

    const athleteWinsMap = new Map();
    const ensureAthlete = (teamCode, teamName, rawName, preferredFirst, genderLabel) => {
      const display = formatSwimmerDisplay(rawName, preferredFirst);
      const key = `${teamCode}|${normalizeSwimmerKey(display)}`;
      if (!athleteWinsMap.has(key)) {
        athleteWinsMap.set(key, {
          key,
          teamCode,
          teamName,
          swimmerDisplay: display,
          genderLabel,
          individualWins: [],
          relayWins: [],
          totalWins: 0,
        });
      }
      return athleteWinsMap.get(key);
    };

    // Tally Individual Wins (place === 1)
    parsedData.individualResults.forEach((r) => {
      if (r.place === 1) {
        const t = ensureTeam(r.teamCode, r.teamName);
        t.individualWins += 1;
        t.totalWins += 1;
        if (r.genderLabel === 'Women') t.womenWins += 1;
        else if (r.genderLabel === 'Men') t.menWins += 1;

        const ath = ensureAthlete(
          r.teamCode,
          r.teamName,
          r.swimmerName,
          r.preferredFirst,
          r.genderLabel
        );
        ath.individualWins.push({
          eventNumber: r.eventNumber,
          eventLabel: r.eventLabel,
          time: r.finalsTime,
        });
        ath.totalWins += 1;
      }
    });

    // Tally Relay Wins (place === 1)
    parsedData.relayResults.forEach((rel) => {
      if (rel.place === 1) {
        const t = ensureTeam(rel.teamCode, rel.teamName);
        t.relayWins += 1;
        t.totalWins += 1;
        if (rel.genderLabel === 'Women') t.womenWins += 1;
        else if (rel.genderLabel === 'Men') t.menWins += 1;

        rel.legs.forEach((leg) => {
          const ath = ensureAthlete(
            rel.teamCode,
            rel.teamName,
            leg.swimmerName,
            leg.preferredFirst,
            rel.genderLabel
          );
          ath.relayWins.push({
            eventNumber: rel.eventNumber,
            eventLabel: rel.eventLabel,
            time: rel.finalsTime,
            legOrder: leg.legOrder,
          });
          ath.totalWins += 1;
        });
      }
    });

    const teamWins = Array.from(teamWinsMap.values()).sort((a, b) => b.totalWins - a.totalWins);
    const allWinners = Array.from(athleteWinsMap.values()).sort((a, b) => {
      if (b.totalWins !== a.totalWins) return b.totalWins - a.totalWins;
      if (b.individualWins.length !== a.individualWins.length) {
        return b.individualWins.length - a.individualWins.length;
      }
      return a.swimmerDisplay.localeCompare(b.swimmerDisplay);
    });

    const multiWinAthletes = allWinners.filter((a) => a.totalWins >= 2);
    const totalEventsWon = teamWins.reduce((sum, t) => sum + t.totalWins, 0);

    return {
      teamWins,
      multiWinAthletes,
      allWinners,
      totalEventsWon,
    };
  }, [parsedData]);

  // Filtered Multi-Win Athletes based on direct Team and Gender controls
  const filteredMultiWinAthletes = useMemo(() => {
    return winSummary.multiWinAthletes.filter((ath) => {
      if (multiWinTeamFilter !== 'ALL' && ath.teamCode !== multiWinTeamFilter) return false;
      if (multiWinGenderFilter !== 'ALL' && ath.genderLabel !== multiWinGenderFilter) return false;
      return true;
    });
  }, [winSummary.multiWinAthletes, multiWinTeamFilter, multiWinGenderFilter]);

  // Generate SID Post-Meet Copyable Recap Text
  const handleCopyRecapText = () => {
    if (!parsedData) return;
    const lines = [];
    lines.push(`${parsedData.meetInfo.name.toUpperCase()} — MEET RECAP & WIN SUMMARY`);
    if (parsedData.meetInfo.startDate) {
      lines.push(`Date: ${parsedData.meetInfo.startDate} | Location: ${[parsedData.meetInfo.city, parsedData.meetInfo.state].filter(Boolean).join(', ')}`);
    }
    lines.push('');

    if (parsedData.teamScores.length > 0) {
      lines.push('FINAL TEAM SCORES:');
      const w = [...parsedData.teamScores].sort((a, b) => b.womenPoints - a.womenPoints);
      const m = [...parsedData.teamScores].sort((a, b) => b.menPoints - a.menPoints);
      lines.push(`• Women: ${w.map((t) => `${t.name} ${t.womenPoints}`).join(' — ')}`);
      lines.push(`• Men: ${m.map((t) => `${t.name} ${t.menPoints}`).join(' — ')}`);
      lines.push('');
    }

    lines.push('EVENT WINS BREAKDOWN:');
    winSummary.teamWins.forEach((t) => {
      lines.push(
        `• ${t.name}: ${t.totalWins} Total Wins (${t.individualWins} Individual, ${t.relayWins} Relay)`
      );
    });
    lines.push('');

    if (winSummary.multiWinAthletes.length > 0) {
      lines.push('MULTI-EVENT WINNERS (2+ WINS):');
      winSummary.multiWinAthletes.forEach((a) => {
        const indList = a.individualWins.map((e) => `${e.eventLabel} (${e.time})`).join(', ');
        const relList = a.relayWins.map((e) => `${e.eventLabel} (${e.time})`).join(', ');
        const parts = [];
        if (indList) parts.push(`Individual: ${indList}`);
        if (relList) parts.push(`Relays: ${relList}`);
        lines.push(`• ${a.swimmerDisplay} (${a.teamName}) — ${a.totalWins} Wins [${parts.join(' | ')}]`);
      });
      lines.push('');
    }

    if (benchmarkAnalysis.milestones.length > 0) {
      lines.push('PERSONAL BESTS, SEASON BESTS, FRESHMAN RECORDS & ALL-TIME TOP-10 MARKS:');
      benchmarkAnalysis.milestones.forEach((m) => {
        const tags = [];
        if (m.isFreshmanRecord) tags.push('FRESHMAN RECORD');
        if (m.allTimeRank) tags.push(`#${m.allTimeRank} All-Time`);
        if (m.isPB) tags.push(`PB (${m.pbDelta.toFixed(2)}s)`);
        if (m.isSB && !m.isPB) tags.push(`SB (${m.sbDelta.toFixed(2)}s)`);
        lines.push(`• ${m.swimmerDisplay} — ${m.eventLabel}: ${m.timeStr} [${tags.join(', ')}]`);
      });
    }

    navigator.clipboard?.writeText(lines.join('\n'));
    setCopiedRecap(true);
    setTimeout(() => setCopiedRecap(false), 2500);
  };

  // CSV Export Function (using Blob + URL.createObjectURL so special characters never break downloads)
  const handleExportCSV = () => {
    if (!parsedData) return;

    const headers = [
      'Result Type',
      'Event #',
      'Event',
      'Gender',
      'Team Name',
      'Swimmer / Relay',
      'Class',
      'Finals Time',
      'Course',
      'Heat',
      'Lane',
      'Place',
      'Cumulative Splits',
      'Relay Swimmers',
    ];

    const rows = [];

    parsedData.individualResults.forEach((r) => {
      rows.push([
        'Individual',
        r.eventNumber,
        r.eventLabel,
        r.genderLabel,
        r.teamName,
        formatSwimmerDisplay(r.swimmerName, r.preferredFirst),
        r.classYear,
        r.finalsTime,
        r.course,
        r.heat,
        r.lane,
        r.place ?? '',
        r.splits.join(' | '),
        '',
      ]);
    });

    parsedData.relayResults.forEach((r) => {
      const legsText = r.legs
        .map((l) => `${l.legOrder}. ${formatSwimmerDisplay(l.swimmerName, l.preferredFirst)}`)
        .join(' ; ');
      rows.push([
        'Relay',
        r.eventNumber,
        r.eventLabel,
        r.genderLabel,
        r.teamName,
        r.relayTitle,
        '',
        r.finalsTime,
        r.course,
        r.heat,
        r.lane,
        r.place ?? '',
        r.splits.join(' | '),
        legsText,
      ]);
    });

    const csvString = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\r\n');

    // Add UTF-8 BOM so Excel opens special characters cleanly
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeMeetName = (parsedData.meetInfo.name || 'swim_meet')
      .replace(/[^a-z0-9]+/gi, '_')
      .replace(/^_|_$/g, '')
      .toLowerCase();

    link.href = url;
    link.setAttribute('download', `${safeMeetName}_parsed_results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Athletic Navy Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <button
            onClick={() => setActiveSection('home')}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="bg-cyan-500/20 border border-cyan-400/30 p-2 rounded-xl text-cyan-400 group-hover:bg-cyan-500/30 transition">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
                Gettysburg Swim Command Center
                <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  SDIF / Records
                </span>
              </h1>
              <p className="text-xs text-slate-400 hidden md:block">
                Historical Records, Meet Results & Post-Meet Analytics
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2">
            {activeSection !== 'home' && (
              <button
                onClick={() => setActiveSection('home')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              >
                <Home className="w-4 h-4 text-cyan-400" />
                <span>Command Hub</span>
              </button>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Import CL2</span>
            </button>

            {parsedData && (
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline">Export CSV</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-Navigation Section Bar (Visible whenever outside the Home Hub) */}
        {activeSection !== 'home' && (
          <div className="bg-slate-950/90 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto py-1.5">
              {[
                { id: 'history', label: '1. Import / Review History', icon: Database, badge: historicalRecords.length },
                { id: 'records', label: '2. Records & All-Time Lists', icon: BookOpen },
                { id: 'inmeet', label: '3. In-Meet Tools', icon: Radio },
                { id: 'results', label: '4. Meet Results', icon: FileText, badge: parsedData ? parsedData.stats.totalSwims : null },
                { id: 'postmeet', label: '5. Post-Meet Tools', icon: Award, badge: parsedData ? `${winSummary.multiWinAthletes.length} MW` : null },
              ].map((nav) => {
                const Icon = nav.icon;
                const active = activeSection === nav.id;
                return (
                  <button
                    key={nav.id}
                    onClick={() => setActiveSection(nav.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      active
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{nav.label}</span>
                    {nav.badge !== null && nav.badge !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          active ? 'bg-white/20 text-white' : 'bg-slate-800 text-cyan-300'
                        }`}
                      >
                        {nav.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      <input
        ref={fileInputRef}
        type="file"
        accept=".cl2,.sd3,.txt"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
          e.target.value = '';
        }}
      />

      <input
        ref={historyCsvInputRef}
        type="file"
        accept=".csv,.tsv,.txt"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) handleHistoryCsvUpload(e.target.files[0]);
          e.target.value = '';
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start justify-between gap-3 text-red-800 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold">Unable to Parse File</h3>
                <p className="text-sm text-red-700 mt-0.5">{errorMsg}</p>
              </div>
            </div>
            <button
              onClick={() => setErrorMsg('')}
              className="text-red-500 hover:text-red-700 p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ================================================================== */}
        {/* COMMAND CENTER HOME SCREEN (5-PILLAR HUB ON LOAD)                  */}
        {/* ================================================================== */}
        {activeSection === 'home' && (
          <div className="space-y-8">
            {/* Hero Status Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 rounded-2xl p-6 sm:p-8 text-white shadow-md border border-slate-800">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 mb-3">
                    <Waves className="w-3.5 h-3.5" />
                    Program Operations & Analytics Hub
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Swim Meet & Program Records Command Center
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
                    Manage your historical Google Sheet database, browse All-Time Top-10 and Freshman records, run live meet tools, or parse Hy-Tek <code className="text-xs bg-white/10 px-1.5 py-0.5 rounded font-mono">.cl2</code> results.
                  </p>
                </div>

                {/* Live System Status Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
                  <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl px-4 py-3">
                    <div className="text-[11px] uppercase tracking-wider text-cyan-200 font-semibold">
                      Historical DB
                    </div>
                    <div className="text-2xl font-extrabold font-mono mt-0.5">
                      {historicalRecords.length}
                    </div>
                    <div className="text-[11px] text-slate-300 mt-0.5">
                      {historicalRecords.length > 0 ? 'Performances Ready' : 'Ready to Import'}
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl px-4 py-3">
                    <div className="text-[11px] uppercase tracking-wider text-cyan-200 font-semibold">
                      Active Meet
                    </div>
                    <div className="text-sm font-bold mt-1 line-clamp-1">
                      {parsedData ? parsedData.meetInfo.name : 'None Loaded'}
                    </div>
                    <div className="text-[11px] text-slate-300 mt-1">
                      {parsedData ? `${parsedData.stats.totalSwims} swims` : 'Upload .CL2 or Sample'}
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-1 bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl px-4 py-3 flex flex-col justify-between">
                    <div className="text-[11px] uppercase tracking-wider text-cyan-200 font-semibold">
                      Quick Demo
                    </div>
                    <button
                      onClick={handleLoadSample}
                      className="mt-1.5 w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Load Sample Meet
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Pillar Navigation Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Pillar 1: Import / Review Historical Data */}
              <div
                onClick={() => setActiveSection('history')}
                className="group bg-white rounded-2xl border-2 border-cyan-500/40 hover:border-cyan-500 p-6 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 group-hover:bg-cyan-600 group-hover:text-white transition">
                      <Database className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                        {masterRoster.length} Roster
                      </span>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
                        {historicalRecords.length} Swims
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition">
                    1. Import / Review Historical Data
                  </h3>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                    Reconcile athletes and competitions against your Master Lists, track active roster status, and review staged Google Sheet imports.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-cyan-700">
                  <span>Open Historical Importer & Master Lists</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Pillar 2: View Records & All-Time Lists */}
              <div
                onClick={() => setActiveSection('records')}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-amber-400 p-6 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:bg-amber-500 group-hover:text-white transition">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      Top-10 & FR
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition">
                    2. View Records & All-Time Lists
                  </h3>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                    Browse Women&apos;s and Men&apos;s Program All-Time Top-10 rankings and Freshman records across every event from your combined database.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
                  <span>Open Record Book</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Pillar 3: In-Meet Tools */}
              <div
                onClick={() => setActiveSection('inmeet')}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 p-6 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition">
                      <Radio className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                      Broadcaster Deck
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition">
                    3. In-Meet Tools
                  </h3>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                    Pre-meet heat sheet & lane-by-lane broadcaster console with live seed times, career PBs, and record proximity notes.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-700">
                  <span>Open In-Meet Console</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Pillar 4: Import Meet Results */}
              <div
                onClick={() => setActiveSection('results')}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-sky-400 p-6 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 group-hover:bg-sky-600 group-hover:text-white transition">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                      {parsedData ? 'Meet Loaded' : '.CL2 / .SD3'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition">
                    4. Import Meet Results
                  </h3>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                    Upload Hy-Tek <code className="text-xs bg-slate-100 px-1 rounded">.cl2</code> files to view dual-meet team scores, event cards, <code className="text-xs bg-slate-100 px-1 rounded">G0</code> lap splits, relay legs, and live PB/Top-10 badges.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-700">
                  <span>{parsedData ? 'View Active Meet Results' : 'Upload or Load Meet'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Pillar 5: Post-Meet Tools */}
              <div
                onClick={() => setActiveSection('postmeet')}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 p-6 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between md:col-span-2 lg:col-span-2"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition">
                      <Award className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Wins, SID Recap & DB Commit
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">
                    5. Post-Meet Tools
                  </h3>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                    Track total event wins, filter Multi-Win athletes by team and gender, generate a one-click SID press recap, and commit Gettysburg&apos;s official results straight into your historical database.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span>Open Post-Meet Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* SECTION 1: IMPORT / REVIEW HISTORICAL DATA (STANDALONE WORKSPACE)  */}
        {/* ================================================================== */}
        {activeSection === 'history' && (
          <div className="space-y-6">
            {/* Section 1 Header & Sub-Tabs */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-100">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-cyan-700 mb-1">
                    Section 1 • Master Historical Database & Canonical Lists
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Database className="w-5 h-5 text-cyan-600" />
                    Import, Reconcile & Manage Master Lists
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Match incoming rows against your <strong>Master Roster</strong> and <strong>Master Competitions</strong> so aliases unify automatically while preserving imported class years (<code className="text-xs bg-slate-100 px-1 rounded">Fr./So./Jr./Sr.</code>).
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {historicalRecords.length > 0 && (
                    <button
                      onClick={handleExportMasterHistoryCSV}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export Master CSV ({historicalRecords.length})
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setHistorySubTab('import');
                      handleStageHistoryText(SAMPLE_GOOGLE_SHEET_CSV);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Stage Sample History
                  </button>
                  <button
                    onClick={() => historyCsvInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    Upload Sheet CSV
                  </button>
                </div>
              </div>

              {/* Section 1 Sub-Navigation Bar */}
              <div className="px-4 sm:px-6 bg-slate-50/90 flex items-center gap-1 overflow-x-auto border-b border-slate-200">
                {[
                  {
                    id: 'import',
                    label: 'Import & Reconcile',
                    icon: FileSpreadsheet,
                    badge: stagedHistoryRows.length > 0 ? stagedHistoryRows.length : null,
                  },
                  {
                    id: 'roster',
                    label: 'Master Roster',
                    icon: UserCheck,
                    badge: masterRoster.length,
                  },
                  {
                    id: 'competitions',
                    label: 'Master Competitions',
                    icon: Building2,
                    badge: masterCompetitions.length,
                  },
                  {
                    id: 'committed',
                    label: 'Committed Database',
                    icon: Database,
                    badge: historicalRecords.length,
                  },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = historySubTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setHistorySubTab(tab.id)}
                      className={`px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                        active
                          ? 'border-cyan-600 text-cyan-700'
                          : 'border-transparent text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                      {tab.badge !== null && (
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                            active
                              ? 'bg-cyan-100 text-cyan-800'
                              : 'bg-slate-200/80 text-slate-700'
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {benchmarkStatusMsg && (
                <div className="mx-5 mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{benchmarkStatusMsg}</span>
                  </div>
                  <button
                    onClick={() => setBenchmarkStatusMsg('')}
                    className="text-emerald-600 hover:text-emerald-800"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* SUB-TAB A: IMPORT & RECONCILE */}
              {historySubTab === 'import' && (
                <div className="p-5 sm:p-6 space-y-5">
                  {/* Season Cutoff & Settings */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Current Season Start Date (For SB)
                      </label>
                      <input
                        type="date"
                        value={seasonStartDate}
                        onChange={(e) => handleSeasonStartChange(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Master Lists Coverage
                      </label>
                      <div className="px-3 py-2 text-xs font-bold bg-white border border-slate-200 rounded-lg text-slate-900 flex items-center justify-between">
                        <span>
                          {masterRoster.filter((a) => a.isActive).length} Active / {masterRoster.length} Roster
                        </span>
                        <span className="text-cyan-700">{masterCompetitions.length} Meets</span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-end">
                      <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2.5 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={countRelayLeadOffs}
                          onChange={(e) => setCountRelayLeadOffs(e.target.checked)}
                          className="rounded text-cyan-600 focus:ring-cyan-500"
                        />
                        Include Flat-Start Relay Leg 1 Lead-Offs
                      </label>
                    </div>
                  </div>

                  {/* Direct Copy-Paste Box from Google Sheets */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                        Paste Rows Directly from Google Sheets (12-Column Format)
                      </label>
                      <button
                        onClick={handleDownloadSampleSheetCSV}
                        className="text-xs font-semibold text-cyan-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        Download Template CSV
                      </button>
                    </div>
                    <textarea
                      rows={5}
                      value={pasteSheetText}
                      onChange={(e) => setPasteSheetText(e.target.value)}
                      placeholder={`Name\tClass\tEvent\tMin\tSec\tDate\tLocation\tCompetition\tPlace\tTime\tEvent\tSeconds\nAva Berry\tFr.\t1000 Free\t10\t45.10\t2026-02-14\tLancaster PA\tCentennial Conference Championships\t3\t10:45.10\tWomen 1000 Freestyle\t645.10`}
                      className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                    />
                    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => handleStageHistoryText(pasteSheetText)}
                          disabled={!pasteSheetText.trim()}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white transition cursor-pointer"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                          Stage & Reconcile Rows
                        </button>
                        <button
                          onClick={() => handleImportHistoryText(pasteSheetText, 'replace')}
                          disabled={!pasteSheetText.trim()}
                          className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white transition cursor-pointer"
                        >
                          Quick Replace All
                        </button>
                      </div>

                      {historicalRecords.length > 0 && masterRoster.length === 0 && (
                        <button
                          onClick={handleSyncMasterListsFromDatabase}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Seed Master Lists from Existing DB ({historicalRecords.length})
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB B: MASTER ATHLETE ROSTER */}
              {historySubTab === 'roster' && (
                <div className="p-5 sm:p-6 space-y-5">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 flex-1">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                          Add Canonical Athlete Name
                        </label>
                        <input
                          type="text"
                          value={newAthleteName}
                          onChange={(e) => setNewAthleteName(e.target.value)}
                          placeholder="e.g., Kathleen Miller"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                          Gender
                        </label>
                        <select
                          value={newAthleteGender}
                          onChange={(e) => setNewAthleteGender(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                          <option value="Women">Women</option>
                          <option value="Men">Men</option>
                        </select>
                      </div>
                      <div className="flex items-end gap-2">
                        <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-2.5 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newAthleteActive}
                            onChange={(e) => setNewAthleteActive(e.target.checked)}
                            className="rounded text-cyan-600 focus:ring-cyan-500"
                          />
                          Active
                        </label>
                        <button
                          onClick={() => {
                            if (!newAthleteName.trim()) return;
                            if (resolveMasterAthlete(newAthleteName)) {
                              setBenchmarkStatusMsg(
                                `"${newAthleteName.trim()}" already exists in the Master Roster.`
                              );
                              return;
                            }
                            updateMasterRoster([
                              ...masterRoster,
                              {
                                id: `ath-${Date.now()}`,
                                canonicalName: newAthleteName.trim(),
                                gender: newAthleteGender,
                                isActive: newAthleteActive,
                                aliases: [],
                              },
                            ]);
                            setNewAthleteName('');
                          }}
                          className="px-4 py-2 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {historicalRecords.length > 0 && (
                      <button
                        onClick={handleSyncMasterListsFromDatabase}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer shrink-0"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        Sync Missing from DB
                      </button>
                    )}
                  </div>

                  {/* Roster Filter Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={rosterSearch}
                        onChange={(e) => setRosterSearch(e.target.value)}
                        placeholder="Search athlete or alias..."
                        className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rosterActiveOnly}
                        onChange={(e) => setRosterActiveOnly(e.target.checked)}
                        className="rounded text-cyan-600 focus:ring-cyan-500"
                      />
                      Show Active Roster Only ({masterRoster.filter((a) => a.isActive).length})
                    </label>
                  </div>

                  {masterRoster.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">
                      No athletes in the Master Roster yet. Add athletes above, sync from your committed database, or stage a Google Sheet import to reconcile new swimmers.
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-slate-500">
                          <tr>
                            <th className="py-2.5 px-4 w-20 text-center">Active</th>
                            <th className="py-2.5 px-4">Canonical Name</th>
                            <th className="py-2.5 px-4">Gender</th>
                            <th className="py-2.5 px-4">Mapped Aliases (Nicknames / Spelling Variants)</th>
                            <th className="py-2.5 px-4 w-16 text-center">Delete</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {masterRoster
                            .filter((a) => {
                              if (rosterActiveOnly && !a.isActive) return false;
                              if (rosterSearch.trim()) {
                                const q = rosterSearch.toLowerCase();
                                const hay = `${a.canonicalName} ${(a.aliases || []).join(' ')}`.toLowerCase();
                                if (!hay.includes(q)) return false;
                              }
                              return true;
                            })
                            .sort((a, b) => a.canonicalName.localeCompare(b.canonicalName))
                            .map((ath) => (
                              <tr key={ath.id} className="hover:bg-slate-50">
                                <td className="py-2.5 px-4 text-center">
                                  <input
                                    type="checkbox"
                                    checked={!!ath.isActive}
                                    onChange={() =>
                                      updateMasterRoster(
                                        masterRoster.map((item) =>
                                          item.id === ath.id
                                            ? { ...item, isActive: !item.isActive }
                                            : item
                                        )
                                      )
                                    }
                                    className="rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                                  />
                                </td>
                                <td className="py-2.5 px-4 font-bold text-slate-900">
                                  {ath.canonicalName}
                                </td>
                                <td className="py-2.5 px-4">
                                  <span
                                    className={`px-2 py-0.5 rounded font-semibold ${
                                      ath.gender === 'Women'
                                        ? 'bg-pink-50 text-pink-700'
                                        : 'bg-sky-50 text-sky-700'
                                    }`}
                                  >
                                    {ath.gender}
                                  </span>
                                </td>
                                <td className="py-2.5 px-4">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    {(ath.aliases || []).map((al, idx) => (
                                      <span
                                        key={idx}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 font-medium"
                                      >
                                        {al}
                                        <button
                                          onClick={() =>
                                            updateMasterRoster(
                                              masterRoster.map((item) =>
                                                item.id === ath.id
                                                  ? {
                                                      ...item,
                                                      aliases: item.aliases.filter(
                                                        (_, i) => i !== idx
                                                      ),
                                                    }
                                                  : item
                                              )
                                            )
                                          }
                                          className="text-cyan-600 hover:text-red-600 cursor-pointer"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </span>
                                    ))}
                                    <button
                                      onClick={() => {
                                        const aliasInput = window.prompt(
                                          `Add an alias/nickname that should automatically resolve to "${ath.canonicalName}":`
                                        );
                                        if (aliasInput && aliasInput.trim()) {
                                          updateMasterRoster(
                                            masterRoster.map((item) =>
                                              item.id === ath.id
                                                ? {
                                                    ...item,
                                                    aliases: [
                                                      ...(item.aliases || []),
                                                      aliasInput.trim(),
                                                    ],
                                                  }
                                                : item
                                            )
                                          );
                                        }
                                      }}
                                      className="text-[11px] font-semibold text-slate-500 hover:text-cyan-700 px-1.5 py-0.5 rounded border border-dashed border-slate-300 cursor-pointer"
                                    >
                                      + Alias
                                    </button>
                                  </div>
                                </td>
                                <td className="py-2.5 px-4 text-center">
                                  <button
                                    onClick={() =>
                                      updateMasterRoster(
                                        masterRoster.filter((item) => item.id !== ath.id)
                                      )
                                    }
                                    className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* SUB-TAB C: MASTER COMPETITIONS */}
              {historySubTab === 'competitions' && (
                <div className="p-5 sm:p-6 space-y-5">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                          Canonical Competition Name
                        </label>
                        <input
                          type="text"
                          value={newCompName}
                          onChange={(e) => setNewCompName(e.target.value)}
                          placeholder="e.g., Centennial Conference Championships"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                          Default Location
                        </label>
                        <input
                          type="text"
                          value={newCompLocation}
                          onChange={(e) => setNewCompLocation(e.target.value)}
                          placeholder="e.g., Lancaster PA"
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => {
                            if (!newCompName.trim()) return;
                            if (resolveMasterCompetition(newCompName)) {
                              setBenchmarkStatusMsg(
                                `"${newCompName.trim()}" already exists in Master Competitions.`
                              );
                              return;
                            }
                            updateMasterCompetitions([
                              ...masterCompetitions,
                              {
                                id: `comp-${Date.now()}`,
                                canonicalName: newCompName.trim(),
                                defaultLocation: newCompLocation.trim(),
                                aliases: [],
                              },
                            ]);
                            setNewCompName('');
                            setNewCompLocation('');
                          }}
                          className="px-4 py-2 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition cursor-pointer"
                        >
                          Add Competition
                        </button>
                      </div>
                    </div>

                    {historicalRecords.length > 0 && (
                      <button
                        onClick={handleSyncMasterListsFromDatabase}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer shrink-0"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        Sync Missing from DB
                      </button>
                    )}
                  </div>

                  {masterCompetitions.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">
                      No canonical competitions added yet. Add recurring meets above or stage a Google Sheet import to reconcile meet names.
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-slate-500">
                          <tr>
                            <th className="py-2.5 px-4">Canonical Competition</th>
                            <th className="py-2.5 px-4">Default Location</th>
                            <th className="py-2.5 px-4">Mapped Aliases</th>
                            <th className="py-2.5 px-4 w-16 text-center">Delete</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {masterCompetitions
                            .slice()
                            .sort((a, b) => a.canonicalName.localeCompare(b.canonicalName))
                            .map((comp) => (
                              <tr key={comp.id} className="hover:bg-slate-50">
                                <td className="py-2.5 px-4 font-bold text-slate-900">
                                  {comp.canonicalName}
                                </td>
                                <td className="py-2.5 px-4 text-slate-600">
                                  {comp.defaultLocation || '-'}
                                </td>
                                <td className="py-2.5 px-4">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    {(comp.aliases || []).map((al, idx) => (
                                      <span
                                        key={idx}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 font-medium"
                                      >
                                        {al}
                                        <button
                                          onClick={() =>
                                            updateMasterCompetitions(
                                              masterCompetitions.map((item) =>
                                                item.id === comp.id
                                                  ? {
                                                      ...item,
                                                      aliases: item.aliases.filter(
                                                        (_, i) => i !== idx
                                                      ),
                                                    }
                                                  : item
                                              )
                                            )
                                          }
                                          className="text-indigo-600 hover:text-red-600 cursor-pointer"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </span>
                                    ))}
                                    <button
                                      onClick={() => {
                                        const aliasInput = window.prompt(
                                          `Add a competition name alias that should map to "${comp.canonicalName}":`
                                        );
                                        if (aliasInput && aliasInput.trim()) {
                                          updateMasterCompetitions(
                                            masterCompetitions.map((item) =>
                                              item.id === comp.id
                                                ? {
                                                    ...item,
                                                    aliases: [
                                                      ...(item.aliases || []),
                                                      aliasInput.trim(),
                                                    ],
                                                  }
                                                : item
                                            )
                                          );
                                        }
                                      }}
                                      className="text-[11px] font-semibold text-slate-500 hover:text-cyan-700 px-1.5 py-0.5 rounded border border-dashed border-slate-300 cursor-pointer"
                                    >
                                      + Alias
                                    </button>
                                  </div>
                                </td>
                                <td className="py-2.5 px-4 text-center">
                                  <button
                                    onClick={() =>
                                      updateMasterCompetitions(
                                        masterCompetitions.filter((item) => item.id !== comp.id)
                                      )
                                    }
                                    className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* SUB-TAB D: COMMITTED DATABASE */}
              {historySubTab === 'committed' && (
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      Committed Database Records ({historicalRecords.length})
                    </span>
                    {historicalRecords.length > 0 && (
                      <button
                        onClick={() => {
                          updateHistoricalRecords([]);
                          setBenchmarkStatusMsg('Cleared historical benchmark database.');
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear Entire Database
                      </button>
                    )}
                  </div>

                  {historicalRecords.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-500 border border-dashed border-slate-200 rounded-xl">
                      No performances committed yet. Stage and commit rows from the Import & Reconcile tab.
                    </div>
                  ) : (
                    <div className="overflow-x-auto max-h-96 border border-slate-200 rounded-xl">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 font-bold uppercase text-slate-500">
                          <tr>
                            <th className="py-2.5 px-4">Name</th>
                            <th className="py-2.5 px-4">Class</th>
                            <th className="py-2.5 px-4">Event</th>
                            <th className="py-2.5 px-4 text-right">Time</th>
                            <th className="py-2.5 px-4">Type</th>
                            <th className="py-2.5 px-4">Date</th>
                            <th className="py-2.5 px-4">Competition</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {historicalRecords.slice(0, 100).map((h) => (
                            <tr key={h.id} className="hover:bg-slate-50">
                              <td className="py-2 px-4 font-semibold text-slate-800">{h.nameRaw}</td>
                              <td className="py-2 px-4">
                                {h.classYear ? (
                                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                                    {h.classYear}
                                  </span>
                                ) : (
                                  '-'
                                )}
                              </td>
                              <td className="py-2 px-4 text-slate-700">{h.eventRaw}</td>
                              <td className="py-2 px-4 text-right font-mono font-bold text-slate-900">
                                {h.time}
                              </td>
                              <td className="py-2 px-4">
                                {h.isOfficial === false ? (
                                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                                    Split ({h.place})
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">
                                    Official
                                  </span>
                                )}
                              </td>
                              <td className="py-2 px-4 text-slate-500">{h.date || '-'}</td>
                              <td className="py-2 px-4 text-slate-600">{h.competition || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RECONCILIATION PROMPT PANEL (Appears whenever staged rows have unmatched athletes or competitions) */}
            {stagedHistoryRows.length > 0 &&
              (stagedUnmatchedSummary.athletes.length > 0 ||
                stagedUnmatchedSummary.competitions.length > 0) && (
                <div className="bg-white rounded-2xl border-2 border-amber-400/80 shadow-sm overflow-hidden">
                  <div className="bg-amber-950 px-5 py-3.5 text-white flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                      <div>
                        <h3 className="text-sm sm:text-base font-bold">
                          Reconciliation Required ({stagedUnmatchedSummary.athletes.length} New/Unmatched Athletes • {stagedUnmatchedSummary.competitions.length} Competitions)
                        </h3>
                        <p className="text-xs text-amber-200/90">
                          Map spelling/nickname variants as an alias to an existing Master entry, or create a new Master entry before committing.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleAutoCreateAllUnmatched(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-amber-950 transition cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        Create All New (Active)
                      </button>
                      <button
                        onClick={() => handleAutoCreateAllUnmatched(false)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-900 hover:bg-amber-800 text-amber-100 border border-amber-700 transition cursor-pointer"
                      >
                        Create All New (Alumni/Inactive)
                      </button>
                    </div>
                  </div>

                  <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Unmatched Athletes Reconciliation List */}
                    {stagedUnmatchedSummary.athletes.length > 0 && (
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4 text-cyan-600" />
                          Unmatched Athletes ({stagedUnmatchedSummary.athletes.length})
                        </h4>
                        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl max-h-72 overflow-y-auto">
                          {stagedUnmatchedSummary.athletes.map((item) => {
                            const selKey = `ath-${item.key}`;
                            const selectedTarget = reconcileSelections[selKey] || '__NEW__';
                            const activeState =
                              reconcileSelections[`${selKey}-active`] !== undefined
                                ? reconcileSelections[`${selKey}-active`]
                                : true;

                            return (
                              <div
                                key={item.key}
                                className="p-3 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                              >
                                <div>
                                  <div className="text-xs font-bold text-slate-900">
                                    {item.rawName}
                                  </div>
                                  <div className="text-[11px] text-slate-500">
                                    {item.count} {item.count === 1 ? 'swim' : 'swims'} • {item.inferredGender}
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-1.5">
                                  <select
                                    value={selectedTarget}
                                    onChange={(e) =>
                                      setReconcileSelections((prev) => ({
                                        ...prev,
                                        [selKey]: e.target.value,
                                      }))
                                    }
                                    className="px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg max-w-[180px]"
                                  >
                                    <option value="__NEW__">+ Create New Athlete</option>
                                    {masterRoster
                                      .slice()
                                      .sort((a, b) =>
                                        a.canonicalName.localeCompare(b.canonicalName)
                                      )
                                      .map((ath) => (
                                        <option key={ath.id} value={ath.id}>
                                          Alias → {ath.canonicalName}
                                        </option>
                                      ))}
                                  </select>

                                  {selectedTarget === '__NEW__' && (
                                    <label className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded-lg cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={activeState}
                                        onChange={(e) =>
                                          setReconcileSelections((prev) => ({
                                            ...prev,
                                            [`${selKey}-active`]: e.target.checked,
                                          }))
                                        }
                                        className="rounded text-cyan-600"
                                      />
                                      Active
                                    </label>
                                  )}

                                  <button
                                    onClick={() =>
                                      handleReconcileAthlete(item, selectedTarget, activeState)
                                    }
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition cursor-pointer"
                                  >
                                    <Link2 className="w-3 h-3" />
                                    Apply
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Unmatched Competitions Reconciliation List */}
                    {stagedUnmatchedSummary.competitions.length > 0 && (
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-indigo-600" />
                          Unmatched Competitions ({stagedUnmatchedSummary.competitions.length})
                        </h4>
                        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl max-h-72 overflow-y-auto">
                          {stagedUnmatchedSummary.competitions.map((item) => {
                            const selKey = `comp-${item.key}`;
                            const selectedTarget = reconcileSelections[selKey] || '__NEW__';

                            return (
                              <div
                                key={item.key}
                                className="p-3 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                              >
                                <div>
                                  <div className="text-xs font-bold text-slate-900">
                                    {item.rawComp}
                                  </div>
                                  <div className="text-[11px] text-slate-500">
                                    {item.count} {item.count === 1 ? 'row' : 'rows'}
                                    {item.sampleLocation ? ` • ${item.sampleLocation}` : ''}
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-1.5">
                                  <select
                                    value={selectedTarget}
                                    onChange={(e) =>
                                      setReconcileSelections((prev) => ({
                                        ...prev,
                                        [selKey]: e.target.value,
                                      }))
                                    }
                                    className="px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg max-w-[180px]"
                                  >
                                    <option value="__NEW__">+ Create New Meet</option>
                                    {masterCompetitions
                                      .slice()
                                      .sort((a, b) =>
                                        a.canonicalName.localeCompare(b.canonicalName)
                                      )
                                      .map((c) => (
                                        <option key={c.id} value={c.id}>
                                          Alias → {c.canonicalName}
                                        </option>
                                      ))}
                                  </select>

                                  <button
                                    onClick={() =>
                                      handleReconcileCompetition(item, selectedTarget)
                                    }
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer"
                                  >
                                    <Link2 className="w-3 h-3" />
                                    Apply
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Staging & Review Inspector Table */}
            {stagedHistoryRows.length > 0 && (
              <div className="bg-white rounded-2xl border-2 border-cyan-500/40 shadow-sm overflow-hidden">
                <div className="bg-slate-900 px-5 py-4 text-white flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-cyan-400" />
                      Staging Review ({stagedHistoryRows.filter((r) => r.selected).length} of {stagedHistoryRows.length} selected)
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Verify canonical athlete & competition matches, class years, official vs. <code className="text-cyan-300">R/S</code> split flags, and duplicates before committing.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleCommitStagedRows('append')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Commit Selected (Append)
                    </button>
                    <button
                      onClick={() => handleCommitStagedRows('replace')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition cursor-pointer"
                    >
                      Replace Entire DB with Selected
                    </button>
                    <button
                      onClick={() => setStagedHistoryRows([])}
                      className="px-2.5 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                    >
                      Discard
                    </button>
                  </div>
                </div>

                {/* Staging Filter Bar */}
                <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'all', label: `All Staged (${stagedHistoryRows.length})` },
                      {
                        id: 'unmatched',
                        label: `Unmatched (${
                          stagedHistoryRows.filter(
                            (r) =>
                              !r.matchedAthleteId ||
                              (r.rawImportedCompetition && !r.matchedCompId)
                          ).length
                        })`,
                      },
                      { id: 'official', label: `Official Marks (${stagedHistoryRows.filter((r) => r.isOfficial).length})` },
                      { id: 'splits', label: `R/S Splits (${stagedHistoryRows.filter((r) => !r.isOfficial).length})` },
                      { id: 'duplicates', label: `Duplicates (${stagedHistoryRows.filter((r) => r.isDuplicate).length})` },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setStagedFilter(f.id)}
                        className={`px-2.5 py-1 rounded-md font-semibold transition cursor-pointer ${
                          stagedFilter === f.id
                            ? 'bg-slate-900 text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setStagedHistoryRows((prev) => prev.map((r) => ({ ...r, selected: true })))
                      }
                      className="text-cyan-700 font-semibold hover:underline cursor-pointer"
                    >
                      Select All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      onClick={() =>
                        setStagedHistoryRows((prev) =>
                          prev.map((r) => ({ ...r, selected: !r.isDuplicate }))
                        )
                      }
                      className="text-cyan-700 font-semibold hover:underline cursor-pointer"
                    >
                      Uncheck Duplicates
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 font-bold uppercase text-slate-500">
                      <tr>
                        <th className="py-2.5 px-4 w-10 text-center">Import</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4">Resolved Athlete</th>
                        <th className="py-2.5 px-4">Class</th>
                        <th className="py-2.5 px-4">Normalized Event</th>
                        <th className="py-2.5 px-4 text-right">Time</th>
                        <th className="py-2.5 px-4">Date</th>
                        <th className="py-2.5 px-4">Resolved Competition</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {stagedHistoryRows
                        .filter((r) => {
                          if (stagedFilter === 'unmatched')
                            return (
                              !r.matchedAthleteId ||
                              (r.rawImportedCompetition && !r.matchedCompId)
                            );
                          if (stagedFilter === 'official') return r.isOfficial;
                          if (stagedFilter === 'splits') return !r.isOfficial;
                          if (stagedFilter === 'duplicates') return r.isDuplicate;
                          return true;
                        })
                        .slice(0, 150)
                        .map((row) => (
                          <tr
                            key={row.id}
                            className={row.isDuplicate ? 'bg-amber-50/40' : 'hover:bg-slate-50'}
                          >
                            <td className="py-2 px-4 text-center">
                              <input
                                type="checkbox"
                                checked={row.selected}
                                onChange={() =>
                                  setStagedHistoryRows((prev) =>
                                    prev.map((item) =>
                                      item.id === row.id
                                        ? { ...item, selected: !item.selected }
                                        : item
                                    )
                                  )
                                }
                                className="rounded text-cyan-600 focus:ring-cyan-500"
                              />
                            </td>
                            <td className="py-2 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                {row.isDuplicate && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                                    <AlertTriangle className="w-3 h-3" />
                                    Dup
                                  </span>
                                )}
                                {row.isOfficial ? (
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                                    Official
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                                    Split ({row.place})
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-2 px-4">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-slate-900">{row.nameRaw}</span>
                                {row.matchedAthleteId ? (
                                  <span
                                    title={
                                      row.matchedAthleteActive
                                        ? 'Matched Active Roster Athlete'
                                        : 'Matched Alumni/Inactive Athlete'
                                    }
                                    className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                      row.matchedAthleteActive
                                        ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                                        : 'bg-slate-100 text-slate-600'
                                    }`}
                                  >
                                    {row.matchedAthleteActive ? 'Active' : 'Alumni'}
                                  </span>
                                ) : (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                                    New
                                  </span>
                                )}
                              </div>
                              {row.rawImportedName && row.rawImportedName !== row.nameRaw && (
                                <div className="text-[10px] text-slate-400">
                                  Sheet: {row.rawImportedName}
                                </div>
                              )}
                            </td>
                            <td className="py-2 px-4">
                              {row.classYear ? (
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                                  {row.classYear}
                                </span>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td className="py-2 px-4 text-slate-700">
                              {row.eventKey || (
                                <span className="text-red-600 font-semibold">
                                  Unrecognized ({row.eventRaw})
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-4 text-right font-mono font-bold text-slate-900">
                              {row.time}
                            </td>
                            <td className="py-2 px-4 text-slate-500">{row.date || '-'}</td>
                            <td className="py-2 px-4">
                              <div className="flex items-center gap-1.5">
                                <span className="text-slate-700 font-medium">
                                  {row.competition || '-'}
                                </span>
                                {row.competition && !row.matchedCompId && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                                    New
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================== */}
        {/* SECTION 2: VIEW RECORDS & ALL-TIME LISTS (STANDALONE RECORD BOOK)  */}
        {/* ================================================================== */}
        {activeSection === 'records' && (
          <div className="space-y-6">
            {historicalRecords.length === 0 || recordBookData.eventList.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No Records in Database Yet</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto mt-2">
                  Import your historical Google Sheet data or commit a meet first to generate Women&apos;s and Men&apos;s All-Time Top-10 lists and Freshman records.
                </p>
                <button
                  onClick={() => setActiveSection('history')}
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition cursor-pointer"
                >
                  <Database className="w-4 h-4" />
                  Go to Import / Review Historical Data
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-slate-900 to-cyan-950 px-5 py-4 text-white flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-5 h-5 text-amber-400" />
                    <div>
                      <h2 className="text-base sm:text-lg font-bold">
                        Program All-Time Top-10 & Freshman Record Book
                      </h2>
                      <p className="text-xs text-slate-300">
                        Comparing <strong className="text-cyan-300">{recordBookData.historicalCount}</strong> imported Sheet marks + <strong className="text-emerald-300">{recordBookData.meetCount}</strong> committed meet marks
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                      {['Women', 'Men'].map((g) => (
                        <button
                          key={g}
                          onClick={() => {
                            setRecordBookGender(g);
                            setRecordBookEventKey('');
                          }}
                          className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                            recordBookGender === g
                              ? 'bg-cyan-600 text-white'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>

                    <select
                      value={recordBookData.activeKey}
                      onChange={(e) => setRecordBookEventKey(e.target.value)}
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      {recordBookData.eventList.map((ev) => (
                        <option key={ev.eventKey} value={ev.eventKey}>
                          {ev.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Freshman Record Banner for Active Event */}
                {recordBookData.freshmanRecord && (
                  <div className="bg-amber-50/90 border-b border-amber-200 px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 font-bold text-amber-900">
                      <Trophy className="w-4 h-4 text-amber-600" />
                      <span>Program Freshman Record:</span>
                      <span className="text-slate-900">
                        {recordBookData.freshmanRecord.nameRaw}
                      </span>
                      <span className="font-mono font-extrabold text-amber-950 bg-amber-200/70 px-2 py-0.5 rounded">
                        {recordBookData.freshmanRecord.time}
                      </span>
                    </div>
                    <span className="text-amber-800">
                      {[
                        recordBookData.freshmanRecord.competition,
                        recordBookData.freshmanRecord.date,
                      ]
                        .filter(Boolean)
                        .join(' • ')}
                    </span>
                  </div>
                )}

                {/* Top 10 Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-2.5 px-4 w-16 text-center">Rank</th>
                        <th className="py-2.5 px-4">Athlete</th>
                        <th className="py-2.5 px-4 text-center">Class</th>
                        <th className="py-2.5 px-4 text-right">Time</th>
                        <th className="py-2.5 px-4">Competition</th>
                        <th className="py-2.5 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recordBookData.top10.map((entry, idx) => (
                        <tr key={entry.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 text-center">
                            <span
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                idx === 0
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : idx < 3
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {idx + 1}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 font-semibold text-slate-900">
                            {entry.nameRaw}
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            {entry.classYear ? (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                                {entry.classYear}
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                            {entry.time}
                          </td>
                          <td className="py-2.5 px-4 text-xs text-slate-600">
                            {entry.competition || '-'}
                          </td>
                          <td className="py-2.5 px-4 text-xs text-slate-500">
                            {entry.date || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================== */}
        {/* SECTION 3: IN-MEET TOOLS (PRE-MEET / BROADCASTER DECK WORKSPACE)   */}
        {/* ================================================================== */}
        {activeSection === 'inmeet' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-sm space-y-4">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Radio className="w-7 h-7" />
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Next Module Ready to Build
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              In-Meet Broadcaster & Heat-by-Heat Console
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              This dedicated workspace will ingest pre-meet heat sheets / psych sheets and cross-reference every lane against your historical database (<strong className="text-slate-800">{historicalRecords.length} records loaded</strong>) to display seed times, career PBs, season bests, and record proximity live during the meet.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setActiveSection('history')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer"
              >
                <Database className="w-4 h-4 text-cyan-400" />
                Prepare Historical Benchmarks
              </button>
              <button
                onClick={() => setActiveSection('results')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                Go to Meet Results
              </button>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* SECTION 4: IMPORT MEET RESULTS (.CL2 / .SD3 PARSER & SCOREBOARDS)  */}
        {/* ================================================================== */}
        {activeSection === 'results' && (
          <>
            {/* Empty State / Drag & Drop Upload Zone */}
            {!parsedData ? (
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`mt-2 border-2 border-dashed rounded-2xl p-8 sm:p-14 text-center transition-all ${
                  isDragging
                    ? 'border-cyan-500 bg-cyan-50/70 scale-[1.01]'
                    : 'border-slate-300 bg-white hover:border-cyan-400'
                } shadow-sm`}
              >
                <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 mb-5">
                  <FileText className="w-8 h-8" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Drop your Hy-Tek Meet Results (.cl2 / .sd3) here
                </h2>
                <p className="text-slate-600 max-w-xl mx-auto mt-2 text-sm sm:text-base">
                  Automatically decodes fixed-width USA Swimming SDIF records (<code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">B1</code>,{' '}
                  <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">C1</code>,{' '}
                  <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">D0/D3</code>,{' '}
                  <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">E0/F0</code>, and{' '}
                  <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">G0</code> splits) into clean tables and spreadsheets.
                </p>

                <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm transition cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-cyan-400" />
                    Select .CL2 / .SD3 File
                  </button>

                  <button
                    onClick={handleLoadSample}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm shadow-sm transition cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Load Sample Meet (Gettysburg v Carnegie Mellon)
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Meet Summary Banner Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 px-6 py-5 text-white flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                        {parsedData.meetInfo.name}
                      </h2>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-2 text-sm text-slate-300">
                        {parsedData.meetInfo.startDate && (
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-cyan-400" />
                            {parsedData.meetInfo.startDate}
                          </span>
                        )}
                        {(parsedData.meetInfo.city || parsedData.meetInfo.state) && (
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-cyan-400" />
                            {[parsedData.meetInfo.city, parsedData.meetInfo.state].filter(Boolean).join(', ')}
                          </span>
                        )}
                        {parsedData.meetInfo.software && (
                          <span className="inline-flex items-center gap-1.5 text-xs bg-white/10 px-2.5 py-0.5 rounded-full text-slate-200">
                            {parsedData.meetInfo.software}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* KPI Stats Pills */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
                      <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-center">
                        <div className="text-xs text-cyan-200 font-medium uppercase tracking-wider">Teams</div>
                        <div className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                          {parsedData.stats.totalTeams}
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-center">
                        <div className="text-xs text-cyan-200 font-medium uppercase tracking-wider">Swimmers</div>
                        <div className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                          {parsedData.stats.totalSwimmers}
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 text-center">
                        <div className="text-xs text-cyan-200 font-medium uppercase tracking-wider">Total Swims</div>
                        <div className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                          {parsedData.stats.totalSwims}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Women's & Men's Team Scoreboards */}
                  {parsedData.teamScores && parsedData.teamScores.length > 0 && (
                    <div className="px-4 sm:px-6 py-4 bg-white border-t border-slate-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Women's Team Score Card */}
                        {(() => {
                          const womenSorted = [...parsedData.teamScores].sort(
                            (a, b) => b.womenPoints - a.womenPoints
                          );
                          return (
                            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                              <div className="flex items-center justify-between mb-2.5">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                                  Women&apos;s Team Scores
                                </span>
                                {womenSorted.length === 2 && (
                                  <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-full">
                                    {womenSorted[0].womenPoints} – {womenSorted[1].womenPoints}
                                  </span>
                                )}
                              </div>
                              <div className="space-y-1.5">
                                {womenSorted.map((t, idx) => (
                                  <div
                                    key={`w-${t.code}`}
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                                      idx === 0 && t.womenPoints > 0
                                        ? 'bg-white border border-amber-200 shadow-2xs font-bold text-slate-900'
                                        : 'bg-white/70 border border-slate-200/70 text-slate-700 font-medium'
                                    }`}
                                  >
                                    <span className="truncate pr-2">{t.name}</span>
                                    <span className="font-mono font-bold tabular-nums">
                                      {t.womenPoints}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Men's Team Score Card */}
                        {(() => {
                          const menSorted = [...parsedData.teamScores].sort(
                            (a, b) => b.menPoints - a.menPoints
                          );
                          return (
                            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                              <div className="flex items-center justify-between mb-2.5">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                                  Men&apos;s Team Scores
                                </span>
                                {menSorted.length === 2 && (
                                  <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-full">
                                    {menSorted[0].menPoints} – {menSorted[1].menPoints}
                                  </span>
                                )}
                              </div>
                              <div className="space-y-1.5">
                                {menSorted.map((t, idx) => (
                                  <div
                                    key={`m-${t.code}`}
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                                      idx === 0 && t.menPoints > 0
                                        ? 'bg-white border border-amber-200 shadow-2xs font-bold text-slate-900'
                                        : 'bg-white/70 border border-slate-200/70 text-slate-700 font-medium'
                                    }`}
                                  >
                                    <span className="truncate pr-2">{t.name}</span>
                                    <span className="font-mono font-bold tabular-nums">
                                      {t.menPoints}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Meet Results Sub-Tabs (Individual, Relays, Roster) + Quick Jump to Post-Meet */}
                  <div className="px-4 sm:px-6 bg-slate-50/80 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1 -mb-px overflow-x-auto">
                      <button
                        onClick={() => {
                          setActiveTab('individual');
                          setSelectedEvent('ALL');
                        }}
                        className={`px-4 py-3.5 text-sm font-semibold border-b-2 transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                          activeTab === 'individual'
                            ? 'border-cyan-600 text-cyan-700'
                            : 'border-transparent text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Timer className="w-4 h-4" />
                        Individual Results
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                          {parsedData.individualResults.length}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('relays');
                          setSelectedEvent('ALL');
                        }}
                        className={`px-4 py-3.5 text-sm font-semibold border-b-2 transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                          activeTab === 'relays'
                            ? 'border-cyan-600 text-cyan-700'
                            : 'border-transparent text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Layers className="w-4 h-4" />
                        Relay Results
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                          {parsedData.relayResults.length}
                        </span>
                      </button>

                      <button
                        onClick={() => setActiveTab('roster')}
                        className={`px-4 py-3.5 text-sm font-semibold border-b-2 transition whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                          activeTab === 'roster'
                            ? 'border-cyan-600 text-cyan-700'
                            : 'border-transparent text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Users className="w-4 h-4" />
                        Team Roster
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                          {parsedData.stats.totalSwimmers}
                        </span>
                      </button>
                    </div>

                    <button
                      onClick={() => setActiveSection('postmeet')}
                      className="my-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5" />
                      Post-Meet Wins & Commit
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
                    {/* Search Input */}
                    <div className="relative lg:col-span-4">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search swimmer, team, or event..."
                        className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Team Filter */}
                    <div className="lg:col-span-3 relative">
                      <div className="flex items-center">
                        <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                        <select
                          value={selectedTeam}
                          onChange={(e) => setSelectedTeam(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                        >
                          <option value="ALL">All Teams ({parsedData.teams.length})</option>
                          {parsedData.teams.map((t) => (
                            <option key={t.code} value={t.code}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Event Filter (Hidden on Roster tab) */}
                    {activeTab !== 'roster' ? (
                      <div className="lg:col-span-3">
                        <select
                          value={selectedEvent}
                          onChange={(e) => setSelectedEvent(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white"
                        >
                          <option value="ALL">All Events ({availableEvents.length})</option>
                          {availableEvents.map((ev) => (
                            <option key={ev.label} value={ev.label}>
                              #{ev.num} — {ev.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="lg:col-span-3 hidden lg:block" />
                    )}

                    {/* Gender Segmented Toggle */}
                    <div className="lg:col-span-2 flex bg-slate-100 p-1 rounded-lg border border-slate-200/80">
                      {['ALL', 'Men', 'Women'].map((g) => (
                        <button
                          key={g}
                          onClick={() => setSelectedGender(g)}
                          className={`flex-1 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                            selectedGender === g
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {g === 'ALL' ? 'All' : g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* TAB 1: INDIVIDUAL RESULTS (GROUPED BY EVENT CARDS) */}
                {activeTab === 'individual' && (
                  <div className="space-y-5">
                    {groupedIndividualEvents.length === 0 ? (
                      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
                        No individual results match your current filter criteria.
                      </div>
                    ) : (
                      groupedIndividualEvents.map((group) => {
                        const expandableSwims = group.swims.filter(
                          (r) => r.splits && r.splits.length > 0
                        );
                        const allExpanded =
                          expandableSwims.length > 0 &&
                          expandableSwims.every((r) => expandedRows.has(r.id));

                        return (
                          <div
                            key={group.key}
                            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                          >
                            {/* Event Card Header */}
                            <div className="bg-slate-900 px-5 py-3.5 text-white flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                                  Event #{group.eventNumber}
                                </span>
                                <h3 className="text-base sm:text-lg font-bold tracking-tight">
                                  {group.eventLabel}
                                </h3>
                                <span className="text-xs text-slate-400 hidden sm:inline">
                                  ({group.swims.length} {group.swims.length === 1 ? 'swimmer' : 'swimmers'})
                                </span>
                              </div>

                              {expandableSwims.length > 0 && (
                                <button
                                  onClick={() => toggleAllIndividualsInEvent(group.swims)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition cursor-pointer"
                                >
                                  {allExpanded ? (
                                    <>
                                      <ChevronDown className="w-3.5 h-3.5" />
                                      Collapse All Splits
                                    </>
                                  ) : (
                                    <>
                                      <ChevronRight className="w-3.5 h-3.5" />
                                      Expand All Splits ({expandableSwims.length})
                                    </>
                                  )}
                                </button>
                              )}
                            </div>

                            {/* Swimmers Table within Event */}
                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                                    <th className="py-2.5 px-4 w-16 text-center">Place</th>
                                    <th className="py-2.5 px-4">Swimmer</th>
                                    <th className="py-2.5 px-4">Team</th>
                                    <th className="py-2.5 px-4 text-right">Finals Time</th>
                                    <th className="py-2.5 px-4 text-right hidden sm:table-cell">Behind</th>
                                    <th className="py-2.5 px-4 text-center w-14">Pts</th>
                                    <th className="py-2.5 px-4 text-center hidden md:table-cell">H/L</th>
                                    <th className="py-2.5 px-4 text-center w-24">Splits</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                  {group.swims.map((row) => {
                                    const hasSplits = row.splits && row.splits.length > 0;
                                    const isExpanded = expandedRows.has(row.id);
                                    const splitAnalysis = hasSplits
                                      ? calculateSplitBreakdown(
                                          row.splits,
                                          row.distance,
                                          row.splitInterval,
                                          row.splitType
                                        )
                                      : { rows: [], stats: null };
                                    const splitBreakdown = splitAnalysis.rows;
                                    const pacingStats = splitAnalysis.stats;

                                    const diffSec =
                                      isFinite(row.timeSeconds) && isFinite(group.fastestTimeSec)
                                        ? row.timeSeconds - group.fastestTimeSec
                                        : null;

                                    const bench = benchmarkAnalysis.bySwimId.get(row.id);

                                    return (
                                      <React.Fragment key={row.id}>
                                        <tr
                                          onClick={() => hasSplits && toggleRow(row.id)}
                                          className={`transition-colors ${
                                            hasSplits ? 'cursor-pointer hover:bg-cyan-50/40' : 'hover:bg-slate-50/80'
                                          } ${isExpanded ? 'bg-cyan-50/30' : ''}`}
                                        >
                                          <td className="py-3 px-4 text-center">
                                            {row.place ? (
                                              <span
                                                className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                                                  row.place === 1
                                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                                    : row.place === 2
                                                    ? 'bg-slate-200 text-slate-800'
                                                    : row.place === 3
                                                    ? 'bg-orange-100 text-orange-800'
                                                    : 'text-slate-600'
                                                }`}
                                              >
                                                {row.place}
                                              </span>
                                            ) : (
                                              <span className="text-slate-400">-</span>
                                            )}
                                          </td>

                                          <td className="py-3 px-4">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                              <span className="font-semibold text-slate-900">
                                                {formatSwimmerDisplay(row.swimmerName, row.preferredFirst)}
                                              </span>
                                              {row.classYear && (
                                                <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                                  {row.classYear}
                                                </span>
                                              )}
                                              {bench?.isFreshmanRecord && (
                                                <span
                                                  title={`Breaks Freshman Record of ${bench.prevFreshmanRecord.time} (${bench.prevFreshmanRecord.nameRaw})`}
                                                  className="inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300"
                                                >
                                                  <Trophy className="w-3 h-3 text-amber-600" />
                                                  FR Record
                                                </span>
                                              )}
                                              {bench?.allTimeRank && (
                                                <span
                                                  title={
                                                    bench.bumpedSwimmer
                                                      ? `Moves to #${bench.allTimeRank} All-Time (passes ${bench.bumpedSwimmer.nameRaw} — ${bench.bumpedSwimmer.time})`
                                                      : `Ranks #${bench.allTimeRank} in Program History`
                                                  }
                                                  className="inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200"
                                                >
                                                  <Star className="w-3 h-3 fill-purple-500 text-purple-600" />
                                                  #{bench.allTimeRank} All-Time
                                                </span>
                                              )}
                                              {bench?.isPB && (
                                                <span
                                                  title={`Previous PB: ${bench.prevPB.time} (${bench.prevPB.date || 'Career Best'})`}
                                                  className="inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200"
                                                >
                                                  PB ({bench.pbDelta.toFixed(2)}s)
                                                </span>
                                              )}
                                              {bench?.isSB && !bench?.isPB && (
                                                <span
                                                  title={`Previous SB: ${bench.prevSB.time} (${bench.prevSB.date || 'Season Best'})`}
                                                  className="inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200"
                                                >
                                                  SB ({bench.sbDelta.toFixed(2)}s)
                                                </span>
                                              )}
                                            </div>
                                          </td>

                                          <td className="py-3 px-4 text-slate-700 font-medium">
                                            {row.teamName}
                                          </td>

                                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                                            {row.finalsTime}
                                          </td>

                                          <td className="py-3 px-4 text-right font-mono text-xs hidden sm:table-cell">
                                            {diffSec === null ? (
                                              <span className="text-slate-400">-</span>
                                            ) : diffSec <= 0.001 ? (
                                              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                Leader
                                              </span>
                                            ) : (
                                              <span className="text-slate-500">+{diffSec.toFixed(2)}s</span>
                                            )}
                                          </td>

                                          <td className="py-3 px-4 text-center font-mono text-xs">
                                            {row.points > 0 ? (
                                              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                {row.points}
                                              </span>
                                            ) : (
                                              <span className="text-slate-300">-</span>
                                            )}
                                          </td>

                                          <td className="py-3 px-4 text-center text-xs text-slate-500 hidden md:table-cell">
                                            {row.heat || row.lane ? `H${row.heat || '-'} / L${row.lane || '-'}` : '-'}
                                          </td>

                                          <td className="py-3 px-4 text-center">
                                            {hasSplits ? (
                                              <button
                                                type="button"
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border border-cyan-200 transition cursor-pointer"
                                              >
                                                {isExpanded ? (
                                                  <>
                                                    <ChevronDown className="w-3.5 h-3.5" />
                                                    Hide ({row.splits.length})
                                                  </>
                                                ) : (
                                                  <>
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                    {row.splits.length} splits
                                                  </>
                                                )}
                                              </button>
                                            ) : (
                                              <span className="text-xs text-slate-400">—</span>
                                            )}
                                          </td>
                                        </tr>

                                        {/* Expanded Splits Drawer */}
                                        {isExpanded && hasSplits && (
                                          <tr className="bg-slate-50/95">
                                            <td colSpan={8} className="p-4 sm:px-8 border-b border-slate-200">
                                              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                                                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                                                    <Timer className="w-4 h-4 text-cyan-600" />
                                                    Split Breakdown — {formatSwimmerDisplay(row.swimmerName, row.preferredFirst)} ({row.eventLabel})
                                                  </div>
                                                  {pacingStats && (
                                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                                                        <TrendingUp className="w-3.5 h-3.5 text-cyan-600" />
                                                        Avg {pacingStats.interval}y: <strong className="font-mono">{pacingStats.avgLap}</strong>
                                                      </span>
                                                      {pacingStats.halfDiff !== null && (
                                                        <span
                                                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold ${
                                                            pacingStats.halfDiff < 0
                                                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                          }`}
                                                        >
                                                          <Zap className="w-3.5 h-3.5" />
                                                          2nd Half: {pacingStats.halfDiff > 0 ? `+${pacingStats.halfDiff.toFixed(2)}s` : `${pacingStats.halfDiff.toFixed(2)}s`}
                                                        </span>
                                                      )}
                                                    </div>
                                                  )}
                                                </div>

                                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2">
                                                  {splitBreakdown.map((sp) => (
                                                    <div
                                                      key={sp.index}
                                                      className={`p-2.5 rounded-lg border text-center transition ${
                                                        sp.isFastest
                                                          ? 'bg-emerald-50/70 border-emerald-200'
                                                          : 'bg-slate-50 border-slate-200/80'
                                                      }`}
                                                    >
                                                      <div className="text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1">
                                                        <span>{sp.distanceLabel}</span>
                                                        {sp.isFastest && (
                                                          <span
                                                            title="Fastest Split"
                                                            className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"
                                                          />
                                                        )}
                                                      </div>
                                                      <div className="text-sm font-mono font-bold text-slate-900 mt-0.5">
                                                        {sp.cumulative}
                                                      </div>
                                                      <div
                                                        className={`text-[11px] font-mono font-medium mt-0.5 ${
                                                          sp.isFastest ? 'text-emerald-700 font-semibold' : 'text-cyan-700'
                                                        }`}
                                                      >
                                                        +{sp.lap}
                                                      </div>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            </td>
                                          </tr>
                                        )}
                                      </React.Fragment>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* TAB 2: RELAY RESULTS (GROUPED BY EVENT CARDS) */}
                {activeTab === 'relays' && (
                  <div className="space-y-5">
                    {groupedRelayEvents.length === 0 ? (
                      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
                        No relay results match your current filter criteria.
                      </div>
                    ) : (
                      groupedRelayEvents.map((group) => {
                        const expandableRelays = group.relays.filter(
                          (r) => r.legs.length > 0 || r.splits.length > 0
                        );
                        const allExpanded =
                          expandableRelays.length > 0 &&
                          expandableRelays.every((r) => expandedRows.has(r.id));

                        return (
                          <div
                            key={group.key}
                            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                          >
                            {/* Event Card Header */}
                            <div className="bg-slate-900 px-5 py-3.5 text-white flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                                  Event #{group.eventNumber}
                                </span>
                                <h3 className="text-base sm:text-lg font-bold tracking-tight">
                                  {group.eventLabel}
                                </h3>
                                <span className="text-xs text-slate-400 hidden sm:inline">
                                  ({group.relays.length} {group.relays.length === 1 ? 'squad' : 'squads'})
                                </span>
                              </div>

                              {expandableRelays.length > 0 && (
                                <button
                                  onClick={() => toggleAllRelaysInEvent(group.relays)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition cursor-pointer"
                                >
                                  {allExpanded ? (
                                    <>
                                      <ChevronDown className="w-3.5 h-3.5" />
                                      Collapse All Splits
                                    </>
                                  ) : (
                                    <>
                                      <ChevronRight className="w-3.5 h-3.5" />
                                      Expand All Splits ({expandableRelays.length})
                                    </>
                                  )}
                                </button>
                              )}
                            </div>

                            {/* Relay Squads Table within Event */}
                            <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                                    <th className="py-2.5 px-4 w-16 text-center">Place</th>
                                    <th className="py-2.5 px-4">Relay Squad</th>
                                    <th className="py-2.5 px-4 hidden lg:table-cell">Swimmers (1–4)</th>
                                    <th className="py-2.5 px-4 text-right">Finals Time</th>
                                    <th className="py-2.5 px-4 text-right hidden sm:table-cell">Behind</th>
                                    <th className="py-2.5 px-4 text-center w-14">Pts</th>
                                    <th className="py-2.5 px-4 text-center hidden md:table-cell">H/L</th>
                                    <th className="py-2.5 px-4 text-center w-28">Legs / Splits</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                  {group.relays.map((row) => {
                                    const isExpanded = expandedRows.has(row.id);
                                    const hasDetails = row.legs.length > 0 || row.splits.length > 0;
                                    const legBreakdown = calculateRelayLegBreakdown(row);
                                    const diffSec =
                                      isFinite(row.timeSeconds) && isFinite(group.fastestTimeSec)
                                        ? row.timeSeconds - group.fastestTimeSec
                                        : null;
                                    const leadOffBench = benchmarkAnalysis.bySwimId.get(
                                      `${row.id}-leadoff`
                                    );

                                    return (
                                      <React.Fragment key={row.id}>
                                        <tr
                                          onClick={() => hasDetails && toggleRow(row.id)}
                                          className={`transition-colors ${
                                            hasDetails ? 'cursor-pointer hover:bg-cyan-50/40' : ''
                                          } ${isExpanded ? 'bg-cyan-50/30' : ''}`}
                                        >
                                          <td className="py-3 px-4 text-center">
                                            {row.place ? (
                                              <span
                                                className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                                                  row.place === 1
                                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                                    : row.place === 2
                                                    ? 'bg-slate-200 text-slate-800'
                                                    : row.place === 3
                                                    ? 'bg-orange-100 text-orange-800'
                                                    : 'text-slate-600'
                                                }`}
                                              >
                                                {row.place}
                                              </span>
                                            ) : (
                                              <span className="text-slate-400">-</span>
                                            )}
                                          </td>

                                          <td className="py-3 px-4">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                              <span className="font-semibold text-slate-900">
                                                {row.relayTitle}
                                              </span>
                                              {leadOffBench?.isFreshmanRecord && (
                                                <span
                                                  title={`Lead-Off Breaks Freshman Record of ${leadOffBench.prevFreshmanRecord.time} (${leadOffBench.prevFreshmanRecord.nameRaw})`}
                                                  className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300"
                                                >
                                                  <Trophy className="w-2.5 h-2.5 text-amber-600" />
                                                  Lead-Off FR Record
                                                </span>
                                              )}
                                              {leadOffBench?.allTimeRank && (
                                                <span
                                                  title={`Lead-Off Leg #${leadOffBench.allTimeRank} All-Time (${leadOffBench.timeStr})`}
                                                  className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200"
                                                >
                                                  <Star className="w-2.5 h-2.5 fill-purple-500 text-purple-600" />
                                                  Lead-Off #{leadOffBench.allTimeRank} All-Time
                                                </span>
                                              )}
                                              {leadOffBench?.isPB && (
                                                <span
                                                  title={`Lead-Off PB: ${leadOffBench.timeStr} (Prev: ${leadOffBench.prevPB.time})`}
                                                  className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200"
                                                >
                                                  Lead-Off PB
                                                </span>
                                              )}
                                              {leadOffBench?.isSB && !leadOffBench?.isPB && (
                                                <span
                                                  title={`Lead-Off SB: ${leadOffBench.timeStr} (Prev: ${leadOffBench.prevSB.time})`}
                                                  className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200"
                                                >
                                                  Lead-Off SB
                                                </span>
                                              )}
                                            </div>
                                          </td>

                                          <td className="py-3 px-4 text-xs text-slate-600 hidden lg:table-cell">
                                            {row.legs.length > 0
                                              ? row.legs
                                                  .map((l) =>
                                                    formatSwimmerDisplay(l.swimmerName, l.preferredFirst)
                                                  )
                                                  .join(' • ')
                                              : '—'}
                                          </td>

                                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                                            {row.finalsTime}
                                          </td>

                                          <td className="py-3 px-4 text-right font-mono text-xs hidden sm:table-cell">
                                            {diffSec === null ? (
                                              <span className="text-slate-400">-</span>
                                            ) : diffSec <= 0.001 ? (
                                              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                                Leader
                                              </span>
                                            ) : (
                                              <span className="text-slate-500">+{diffSec.toFixed(2)}s</span>
                                            )}
                                          </td>

                                          <td className="py-3 px-4 text-center font-mono text-xs">
                                            {row.points > 0 ? (
                                              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                {row.points}
                                              </span>
                                            ) : (
                                              <span className="text-slate-300">-</span>
                                            )}
                                          </td>

                                          <td className="py-3 px-4 text-center text-xs text-slate-500 hidden md:table-cell">
                                            {row.heat || row.lane ? `H${row.heat || '-'} / L${row.lane || '-'}` : '-'}
                                          </td>

                                          <td className="py-3 px-4 text-center">
                                            {hasDetails ? (
                                              <button
                                                type="button"
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border border-cyan-200 transition cursor-pointer"
                                              >
                                                {isExpanded ? (
                                                  <>
                                                    <ChevronDown className="w-3.5 h-3.5" />
                                                    Hide
                                                  </>
                                                ) : (
                                                  <>
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                    {row.legs.length} legs
                                                  </>
                                                )}
                                              </button>
                                            ) : (
                                              <span className="text-xs text-slate-400">—</span>
                                            )}
                                          </td>
                                        </tr>

                                        {isExpanded && hasDetails && (
                                          <tr className="bg-slate-50/95">
                                            <td colSpan={8} className="p-4 sm:px-8 border-b border-slate-200">
                                              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-4">
                                                {legBreakdown.length > 0 && (
                                                  <div>
                                                    <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
                                                      <Users className="w-4 h-4 text-cyan-600" />
                                                      Relay Order & Leg Splits ({row.relayTitle})
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                                      {legBreakdown.map((leg) => (
                                                        <div
                                                          key={leg.legOrder}
                                                          className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
                                                        >
                                                          <div>
                                                            <div className="flex items-center justify-between gap-2">
                                                              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-700">
                                                                Leg {leg.legOrder}
                                                              </span>
                                                              <div className="flex items-center gap-1.5">
                                                                {leg.legTotalTime !== '-' && (
                                                                  <span className="text-xs font-mono font-bold bg-white text-slate-900 px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                                                                    {leg.legTotalTime}
                                                                  </span>
                                                                )}
                                                                {leg.classYear && (
                                                                  <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                                                                    {leg.classYear}
                                                                  </span>
                                                                )}
                                                              </div>
                                                            </div>
                                                            <div className="text-sm font-semibold text-slate-900 mt-1">
                                                              {formatSwimmerDisplay(leg.swimmerName, leg.preferredFirst)}
                                                            </div>
                                                          </div>

                                                          {leg.subSplits.length > 0 && (
                                                            <div className="mt-2.5 pt-2 border-t border-slate-200/70 space-y-1">
                                                              {leg.subSplits.map((sub) => (
                                                                <div
                                                                  key={sub.subIndex}
                                                                  className="flex items-center justify-between text-xs font-mono"
                                                                >
                                                                  <span className="text-slate-500">
                                                                    {sub.subDistance}
                                                                  </span>
                                                                  <span className="text-slate-700">
                                                                    {sub.cumulative}{' '}
                                                                    <span className="text-cyan-700 font-semibold">
                                                                      (+{sub.lap})
                                                                    </span>
                                                                  </span>
                                                                </div>
                                                              ))}
                                                            </div>
                                                          )}
                                                        </div>
                                                      ))}
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                            </td>
                                          </tr>
                                        )}
                                      </React.Fragment>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* TAB 3: TEAM ROSTERS */}
                {activeTab === 'roster' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredTeams.map((team) => (
                      <div
                        key={team.code}
                        className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
                      >
                        <div className="bg-slate-900 px-5 py-4 text-white flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold">{team.name}</h3>
                            {(team.city || team.state) && (
                              <p className="text-xs text-slate-400 mt-0.5">
                                {[team.city, team.state].filter(Boolean).join(', ')}
                              </p>
                            )}
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                            {team.swimmerList.length} Athletes
                          </span>
                        </div>

                        <div className="divide-y divide-slate-100 max-h-[540px] overflow-y-auto">
                          {team.swimmerList.length === 0 ? (
                            <div className="p-8 text-center text-sm text-slate-500">
                              No athletes match the current filter.
                            </div>
                          ) : (
                            team.swimmerList.map((swimmer) => (
                              <div key={swimmer.name} className="p-4 hover:bg-slate-50 transition">
                                <div className="flex items-center justify-between gap-2">
                                  <div>
                                    <span className="font-semibold text-slate-900 text-sm">
                                      {formatSwimmerDisplay(swimmer.name, swimmer.preferredFirst)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    {swimmer.classYear && (
                                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                        {swimmer.classYear}
                                      </span>
                                    )}
                                    <span
                                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                        swimmer.gender === 'Women'
                                          ? 'bg-pink-50 text-pink-700'
                                          : 'bg-sky-50 text-sky-700'
                                      }`}
                                    >
                                      {swimmer.gender}
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  {swimmer.events.map((ev, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/70"
                                    >
                                      {ev}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ================================================================== */}
        {/* SECTION 5: POST-MEET TOOLS (WINS, MULTI-WIN, RECAP & DB COMMIT)    */}
        {/* ================================================================== */}
        {activeSection === 'postmeet' && (
          <>
            {!parsedData ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
                  <Award className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No Meet Loaded for Post-Meet Analysis</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto mt-2">
                  Upload a <code className="text-xs bg-slate-100 px-1 rounded">.cl2</code> meet results file (or load the sample meet) to tally event wins, Multi-Win athletes, SID recaps, and commit results to your database.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-cyan-400" />
                    Import .CL2 File
                  </button>
                  <button
                    onClick={handleLoadSample}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Load Sample Meet
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Top Action & Program Focus Bar */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Primary Program Focus (Benchmarks, Record Checks & DB Commit)
                        </label>
                        <select
                          value={primaryTeamCode}
                          onChange={(e) => handlePrimaryTeamChange(e.target.value)}
                          className="px-3 py-2 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                          <option value="ALL">All Teams in Meet</option>
                          {parsedData.teams.map((t) => (
                            <option key={t.code} value={t.code}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="pt-4 flex flex-wrap items-center gap-2">
                        <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={countRelayLeadOffs}
                            onChange={(e) => setCountRelayLeadOffs(e.target.checked)}
                            className="rounded text-cyan-600 focus:ring-cyan-500"
                          />
                          Include Relay Leg 1 Lead-Offs
                        </label>

                        <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeSplitsOnCommit}
                            onChange={(e) => setIncludeSplitsOnCommit(e.target.checked)}
                            className="rounded text-cyan-600 focus:ring-cyan-500"
                          />
                          Also Save Flying Relay/1000 Splits (R/S)
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                      <button
                        onClick={handleCommitMeetToDatabase}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4" />
                        {primaryTeamCode !== 'ALL'
                          ? `Commit ${
                              parsedData.teams.find((t) => t.code === primaryTeamCode)?.name ||
                              primaryTeamCode
                            }`
                          : 'Commit Meet to Database'}
                      </button>

                      <button
                        onClick={handleCopyRecapText}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition cursor-pointer"
                      >
                        {copiedRecap ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            Copied SID Recap!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-cyan-400" />
                            Copy Post-Meet Recap
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {benchmarkStatusMsg && (
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{benchmarkStatusMsg}</span>
                      </div>
                      <button
                        onClick={() => setBenchmarkStatusMsg('')}
                        className="text-emerald-600 hover:text-emerald-800"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Team Event Wins Breakdown Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {winSummary.teamWins.map((tw) => (
                    <div
                      key={tw.code}
                      className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
                            Event Victories
                          </span>
                          <h3 className="text-lg font-bold text-slate-900 mt-0.5">{tw.name}</h3>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-extrabold text-slate-900 font-mono">
                            {tw.totalWins}
                          </div>
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            Total Wins
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-slate-100 text-center">
                        <div className="bg-slate-50 rounded-lg p-2">
                          <div className="text-base font-bold text-slate-900 font-mono">
                            {tw.individualWins}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">Individual</div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2">
                          <div className="text-base font-bold text-slate-900 font-mono">
                            {tw.relayWins}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">Relays</div>
                        </div>
                        <div className="bg-pink-50/60 rounded-lg p-2">
                          <div className="text-base font-bold text-pink-800 font-mono">
                            {tw.womenWins}
                          </div>
                          <div className="text-[11px] text-pink-700 font-medium">Women</div>
                        </div>
                        <div className="bg-sky-50/60 rounded-lg p-2">
                          <div className="text-base font-bold text-sky-800 font-mono">
                            {tw.menWins}
                          </div>
                          <div className="text-[11px] text-sky-700 font-medium">Men</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Multi-Win Athletes Leaderboard */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-900 px-5 py-3.5 text-white flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Medal className="w-5 h-5 text-amber-400" />
                      <h3 className="text-base sm:text-lg font-bold">
                        Multi-Win Athletes (2+ Event Victories)
                      </h3>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold">
                        {filteredMultiWinAthletes.length} Athletes
                      </span>
                    </div>

                    {/* Direct Team & Gender Filters for Multi-Win Athletes */}
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={multiWinTeamFilter}
                        onChange={(e) => setMultiWinTeamFilter(e.target.value)}
                        className="px-2.5 py-1.5 text-xs font-semibold bg-slate-800 text-slate-100 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="ALL">All Teams</option>
                        {parsedData.teams.map((t) => (
                          <option key={t.code} value={t.code}>
                            {t.name}
                          </option>
                        ))}
                      </select>

                      <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                        {['ALL', 'Women', 'Men'].map((g) => (
                          <button
                            key={g}
                            onClick={() => setMultiWinGenderFilter(g)}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                              multiWinGenderFilter === g
                                ? 'bg-cyan-600 text-white shadow-2xs'
                                : 'text-slate-300 hover:text-white'
                            }`}
                          >
                            {g === 'ALL' ? 'All' : g}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {filteredMultiWinAthletes.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-500">
                      No athletes with 2 or more event victories match the selected team/gender filter.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {filteredMultiWinAthletes.map((ath) => (
                        <div
                          key={ath.key}
                          className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50/80 transition"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-base">
                                {ath.swimmerDisplay}
                              </span>
                              <span className="text-xs font-medium text-slate-500">
                                ({ath.teamName})
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {ath.individualWins.map((w, idx) => (
                                <span
                                  key={`ind-${idx}`}
                                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200"
                                >
                                  <Trophy className="w-3 h-3 text-amber-600" />
                                  {w.eventLabel} ({w.time})
                                </span>
                              ))}
                              {ath.relayWins.map((w, idx) => (
                                <span
                                  key={`rel-${idx}`}
                                  className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-cyan-50 text-cyan-900 border border-cyan-200"
                                >
                                  <Layers className="w-3 h-3 text-cyan-600" />
                                  {w.eventLabel} — Leg {w.legOrder} ({w.time})
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <div className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-center">
                              <div className="text-lg font-extrabold font-mono leading-none">
                                {ath.totalWins}
                              </div>
                              <div className="text-[10px] uppercase tracking-wider text-cyan-300 mt-1">
                                Wins ({ath.individualWins.length}I / {ath.relayWins.length}R)
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Record Book, Personal Bests & Season Bests Feed */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-900 px-5 py-3.5 text-white flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-base sm:text-lg font-bold">
                        Personal Bests, Season Bests & Program Top-10 Marks
                      </h3>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-bold">
                      {benchmarkAnalysis.milestones.length} Milestones
                    </span>
                  </div>

                  {historicalRecords.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-sm text-slate-600">
                        No historical benchmarks loaded yet. Open{' '}
                        <button
                          onClick={() => setActiveSection('history')}
                          className="text-cyan-700 font-bold underline cursor-pointer"
                        >
                          1. Import / Review Historical Data
                        </button>{' '}
                        to paste rows from your Google Sheet or stage sample history.
                      </p>
                    </div>
                  ) : benchmarkAnalysis.milestones.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-500">
                      No new PBs, SBs, or Top-10 entries were recorded for the selected primary team in this meet.
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {benchmarkAnalysis.milestones.map((m) => (
                        <div
                          key={m.id}
                          className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50/80"
                        >
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-slate-900">{m.swimmerDisplay}</span>
                              <span className="text-xs text-slate-500">• {m.eventLabel}</span>
                              {m.sourceType === 'Relay Lead-Off' && (
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                                  Flat-Start Lead-Off
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              {m.prevPB && (
                                <span className="mr-3">
                                  Prev PB: <strong className="font-mono">{m.prevPB.time}</strong> ({m.prevPB.date || 'Career'})
                                </span>
                              )}
                              {m.isFreshmanRecord && m.prevFreshmanRecord && (
                                <span className="mr-3 text-amber-800 font-medium">
                                  Breaks FR Record: <strong className="font-mono">{m.prevFreshmanRecord.time}</strong> ({m.prevFreshmanRecord.nameRaw})
                                </span>
                              )}
                              {m.bumpedSwimmer && m.allTimeRank && (
                                <span>
                                  Passes <strong>{m.bumpedSwimmer.nameRaw}</strong> ({m.bumpedSwimmer.time}) for #{m.allTimeRank} All-Time
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono font-extrabold text-base text-slate-900 mr-1">
                              {m.timeStr}
                            </span>
                            {m.isFreshmanRecord && (
                              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                                <Trophy className="w-3 h-3 text-amber-600" />
                                FR Record
                              </span>
                            )}
                            {m.allTimeRank && (
                              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                                <Star className="w-3 h-3 fill-purple-500 text-purple-600" />
                                #{m.allTimeRank} All-Time
                              </span>
                            )}
                            {m.isPB && (
                              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                PB ({m.pbDelta.toFixed(2)}s)
                              </span>
                            )}
                            {m.isSB && !m.isPB && (
                              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                                SB ({m.sbDelta.toFixed(2)}s)
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
