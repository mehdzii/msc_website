\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{rapportINPTCLOUD}[2025/12/08 Custom class for INPT reports]

\LoadClass[12pt]{report}

\RequirePackage[utf8]{inputenc}
\RequirePackage[T1]{fontenc}
\RequirePackage[french]{babel}
\RequirePackage{graphicx}
\RequirePackage{geometry}
\RequirePackage{xcolor}
\RequirePackage{titlesec}
\RequirePackage{fancyhdr}
\RequirePackage{listings}
\RequirePackage{eso-pic}

\RequirePackage{hyperref}

% Variables
\newcommand{\titre}[1]{\def\@titre{#1}}
\newcommand{\sujet}[1]{\def\@sujet{#1}}
\newcommand{\Encadrants}[1]{\def\@Encadrants{#1}}
\newcommand{\eleves}[1]{\def\@eleves{#1}}

% Margins
\newcommand{\fairemarges}{
    \geometry{
        top=2.5cm,
        bottom=2.5cm,
        left=2.5cm,
        right=2.5cm
    }
}

% Title Page
\newcommand{\fairepagedegarde}{
    \begin{titlepage}
        \AddToShipoutPicture*{%
            \put(0,0){%
                \parbox[b][\paperheight]{\paperwidth}{%
                    \vfill
                    \centering
                    \includegraphics[width=\paperwidth,height=\paperheight]{image.png}%
                    \vfill
                }%
            }%
        }%
        \begin{center}
            \vspace*{1cm}
            \includegraphics[width=0.4\textwidth]{logo_inpt.png} \\
            \vspace{0.5cm}
            {\large \textbf{Institut National des Postes et Télécommunications}} \\
            \vspace{2cm}
            
            {\Large \textsc{\@sujet}} \\
            \vspace{0.5cm}
            {\Large \textbf{RAPPORT}} \\
            \vspace{2cm}
            
            \rule{\linewidth}{0.5mm} \\[0.4cm]
            { \Huge \bfseries \@titre } \\[0.4cm]
            \rule{\linewidth}{0.5mm} \\[2cm]
            
            \begin{minipage}{0.4\textwidth}
                \begin{flushleft} \large
                    \emph{Réalisé par :}\\
                    \@eleves
                \end{flushleft}
            \end{minipage}
            \begin{minipage}{0.4\textwidth}
                \begin{flushright} \large
                    \emph{Encadrant :} \\
                    \@Encadrants
                \end{flushright}
            \end{minipage}
            
            \vfill
            
            {\large \today}
            
        \end{center}
    \end{titlepage}
}

% Table of Contents
\newcommand{\tabledematieres}{
    \tableofcontents
    \newpage
}

% Header/Footer
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\@titre}
\fancyhead[R]{\@eleves}
\fancyfoot[C]{\thepage}
