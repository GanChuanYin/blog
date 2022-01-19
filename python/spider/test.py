# -*- coding:UTF-8 -*-
from selenium import webdriver
from bs4 import BeautifulSoup
import re

if __name__ == '__main__':

    options = webdriver.ChromeOptions()
    options.add_argument('user-agent="Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1"')
    driver = webdriver.Chrome(chrome_options=options)
    driver.get('https://wenku.baidu.com/view/aa31a84bcf84b9d528ea7a2c.html')

    html = driver.page_source
    bf1 = BeautifulSoup(html, 'lxml')
    result = bf1.find_all(class_='reader-container')
    bf2 = BeautifulSoup(str(result[0]), 'lxml')
    pagenum = bf2.find_all(class_='size')
    pagenum = BeautifulSoup(str(pagenum), 'lxml').span.string
    pagepattern = re.compile('页数：(\d+)页')
    num = int(pagepattern.findall(pagenum)[0])
    print('文章页数：%d' % num)

    while True:
        num = num / 5.0
        html = driver.page_source
        bf1 = BeautifulSoup(html, 'lxml')
        result = bf1.find_all(class_='rtcspage')
        for each_result in result:
            bf2 = BeautifulSoup(str(each_result), 'lxml')
            texts = bf2.find_all('p')
            for each_text in texts:
                main_body = BeautifulSoup(str(each_text), 'lxml')
                for each in main_body.find_all(True):
                    if each.name == 'span':
                        print(each.string.replace('\xa0',''),end='')
                    elif each.name == 'br':
                        print('')
            print('\n')
        if num > 1:
            page = driver.find_elements_by_xpath("//div[@class='page']")
            driver.execute_script('arguments[0].scrollIntoView();', page[-1]) #拖动到可见的元素去
            nextpage = driver.find_element_by_xpath("//a[@data-fun='next']")
            nextpage.click()
            time.sleep(3)
        else:
            break