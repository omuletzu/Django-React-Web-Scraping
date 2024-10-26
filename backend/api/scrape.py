import selenium.webdriver as webdriver
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup
import time
# from selenium.webdriver import Remote, ChromeOptions
# from selenium.webdriver.chromium.remote_connection import ChromiumRemoteConnection
# from bs4 import BeautifulSoup
# from dotenv import load_dotenv
# import os

def scrape_website(website):
    test_text = """Quantum mechanics is a fundamental theory that describes the behavior of nature at and below the scale of atoms.It is the foundation of all quantum physics, which includes quantum chemistry, quantum field theory, quantum technology, and quantum information science.
                    Quantum mechanics can describe many systems that classical physics cannot. Classical physics can describe many aspects of nature at an ordinary (macroscopic and (optical) microscopic) scale, but is not sufficient for describing them at very small submicroscopic (atomic and subatomic) scales. Most theories in classical physics can be derived from quantum mechanics as an approximation, valid at large (macroscopic/microscopic) scale.
                    Quantum systems have bound states that are quantized to discrete values of energy, momentum, angular momentum, and other quantities, in contrast to classical systems where these quantities can be measured continuously. Measurements of quantum systems show characteristics of both particles and waves (wave-particle duality), and there are limits to how accurately the value of a physical quantity can be predicted prior to its measurement, given a complete set of initial conditions (the uncertainty principle).
                    Quantum mechanics arose gradually from theories to explain observations that could not be reconciled with classical physics, such as Max Planck's solution in 1900 to the black-body radiation problem, and the correspondence between energy and frequency in Albert Einstein's 1905 paper, which explained the photoelectric effect. These early attempts to understand microscopic phenomena, now known as the "old quantum theory", led to the full development of quantum mechanics in the mid-1920s by Niels Bohr, Erwin Schrödinger, Werner Heisenberg, Max Born, Paul Dirac and others. The modern theory is formulated in various specially developed mathematical formalisms. In one of them, a mathematical entity called the wave function provides information, in the form of probability amplitudes, about what measurements of a particle's energy, momentum, and other physical properties may yield.
                    Overview and fundamental concepts
                    Quantum mechanics allows the calculation of properties and behaviour of physical systems. It is typically applied to microscopic systems: molecules, atoms and sub-atomic particles. It has been demonstrated to hold for complex molecules with thousands of atoms, but its application to human beings raises philosophical problems, such as Wigner's friend, and its application to the universe as a whole remains speculative. Predictions of quantum mechanics have been verified experimentally to an extremely high degree of accuracy. For example, the refinement of quantum mechanics for the interaction of light and matter, known as quantum electrodynamics (QED), has been shown to agree with experiment to within 1 part in 1012 when predicting the magnetic properties of an electron.
                    A fundamental feature of the theory is that it usually cannot predict with certainty what will happen, but only give probabilities. Mathematically, a probability is found by taking the square of the absolute value of a complex number, known as a probability amplitude. This is known as the Born rule, named after physicist Max Born. For example, a quantum particle like an electron can be described by a wave function, which associates to each point in space a probability amplitude. Applying the Born rule to these amplitudes gives a probability density function for the position that the electron will be found to have when an experiment is performed to measure it. This is the best the theory can do; it cannot say for certain where the electron will be found. The Schrödinger equation relates the collection of probability amplitudes that pertain to one moment of time to the collection of probability amplitudes that pertain to another.
                    One consequence of the mathematical rules of quantum mechanics is a tradeoff in predictability between measurable quantities. The most famous form of this uncertainty principle says that no matter how a quantum particle is prepared or how carefully experiments upon it are arranged, it is impossible to have a precise prediction for a measurement of its position and also at the same time for a measurement of its momentum."""

    print("Launching Chrome browser...")
    chrome_driver_path = "./chromedriver.exe"
    options = webdriver.ChromeOptions()
    # options.add_argument("--headless")
    # print("Chrome options:", options)
    # driver = webdriver.Chrome(service=Service(chrome_driver_path), options=options)
    # print("Chrome browser launched!")

    # try:
    #     driver.get(website)
    #     print("Page loaded!")
    #     html = driver.page_source
    #     time.sleep(10)
    #     body_content = extract_body_content(html)
    #     cleaned_content = clean_body_content(body_content)
    #     print("Content extracted!")
    #     return cleaned_content
    # except Exception as e:
    #     print("Error:", e)
    #     return ""
    # finally:
    #     driver.quit()
    # # delete the below line and uncomment the above code block (when fixed the chromedriver) to enable scraping
    return test_text


# TODO: Uncomment the below code block to enable scraping with Scraping Browser

# load_dotenv()

# SBR_WEBDRIVER = os.getenv("SBR_WEBDRIVER")

# def scrape_website(website):
#     print("Connecting to Scraping Browser...")
#     sbr_connection = ChromiumRemoteConnection(SBR_WEBDRIVER, "goog", "chrome")
#     with Remote(sbr_connection, options=ChromeOptions()) as driver:
#         driver.get(website)
#         print("Waiting captcha to solve...")
#         solve_res = driver.execute(
#             "executeCdpCommand",
#             {
#                 "cmd": "Captcha.waitForSolve",
#                 "params": {"detectTimeout": 10000},
#             },
#         )
#         print("Captcha solve status:", solve_res["value"]["status"])
#         print("Navigated! Scraping page content...")
#         html = driver.page_source
#         return html


def extract_body_content(html_content):
    soup = BeautifulSoup(html_content, "html.parser")
    body_content = soup.body
    if body_content:
        return str(body_content)
    return ""


def clean_body_content(body_content):
    soup = BeautifulSoup(body_content, "html.parser")

    for script_or_style in soup(["script", "style"]):
        script_or_style.extract()

    cleaned_content = soup.get_text(separator="\n")
    cleaned_content = "\n".join(
        line.strip() for line in cleaned_content.splitlines() if line.strip()
    )

    return cleaned_content


def split_dom_content(dom_content, max_length=4000):
    return [
        dom_content[i : i + max_length] for i in range(0, len(dom_content), max_length)
    ]