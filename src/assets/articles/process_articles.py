import os
import re
import sys

# --- 配置 ---
# 脚本所在目录
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# 项目根目录 (从脚本位置向上回溯三级)
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, '..', '..', '..'))
# 文章源目录
ARTICLES_DIR = os.path.join(PROJECT_ROOT, 'src', 'assets', 'articles')
# 类型定义输出目录
TYPES_DIR = os.path.join(PROJECT_ROOT, 'src', 'types')
# 数据文件输出目录
DATA_DIR = os.path.join(PROJECT_ROOT, 'src', 'data')
# 类型定义文件路径
ARTICLE_TYPE_PATH = os.path.join(TYPES_DIR, 'article.ts')
# 数据文件路径
ARTICLES_DATA_PATH = os.path.join(DATA_DIR, 'articles.ts')

# --- 1. 定义数据结构 ---
def create_article_type_definition():
    """在 src/types/ 目录下创建 article.ts 文件，用于定义文章类型"""
    print(f"确保目录存在: {TYPES_DIR}")
    os.makedirs(TYPES_DIR, exist_ok=True)

    content = """export interface Article {
  id: string;
  title: string;
  author: string;
  content: string;
}
"""
    try:
        with open(ARTICLE_TYPE_PATH, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"成功创建类型定义文件: {ARTICLE_TYPE_PATH}")
    except IOError as e:
        print(f"错误：无法写入文件 {ARTICLE_TYPE_PATH}。原因: {e}", file=sys.stderr)
        sys.exit(1)

# --- 2. 扫描并解析文章 ---
def process_articles():
    """扫描所有文章，解析文件名，读取内容，并返回结构化数据"""
    print(f"开始扫描目录: {ARTICLES_DIR}")
    if not os.path.isdir(ARTICLES_DIR):
        print(f"错误：文章目录不存在 {ARTICLES_DIR}", file=sys.stderr)
        sys.exit(1)

    all_articles_data = []
    article_id_counter = 1
    # 正则表达式用于从文件名《标题》作者.txt中提取标题和作者
    filename_pattern = re.compile(r'《(.*?)》(.*?).txt$')

    for filename in sorted(os.listdir(ARTICLES_DIR)):
        # 忽略脚本自身
        if filename == os.path.basename(__file__):
            continue
            
        if filename.endswith('.txt'):
            match = filename_pattern.match(filename)
            if match:
                title = match.group(1)
                author = match.group(2)
                file_path = os.path.join(ARTICLES_DIR, filename)

                print(f"  处理中: {filename}")

                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                except UnicodeDecodeError:
                    print(f"    警告：文件 {filename} 使用 UTF-8 编码失败，尝试 GBK 编码。")
                    try:
                        with open(file_path, 'r', encoding='gbk') as f:
                            content = f.read()
                    except Exception as e_inner:
                        print(f"    警告：GBK 编码同样失败，跳过文件 {filename}。原因: {e_inner}")
                        continue
                except IOError as e:
                    print(f"    警告：无法读取文件 {filename}，已跳过。原因: {e}")
                    continue

                all_articles_data.append({
                    'id': str(article_id_counter),
                    'title': title,
                    'author': author,
                    'content': content
                })
                article_id_counter += 1
            else:
                print(f"  警告：跳过不符合'《标题》作者.txt'格式的文件: {filename}")

    print(f"成功处理 {len(all_articles_data)} 篇文章。 সন")
    return all_articles_data

# --- 3. 创建数据文件 ---
def create_data_file(articles_data):
    """在 src/data/ 目录下创建 articles.ts 文件，并导出所有文章数据"""
    print(f"确保目录存在: {DATA_DIR}")
    os.makedirs(DATA_DIR, exist_ok=True)

    ts_objects = []
    for article in articles_data:
        # 预先处理好需要转义的字符串，避免在f-string中出现复杂的引号嵌套
        safe_title = article['title'].replace("'", "\'\'")
        safe_author = article['author'].replace("'", "\'\'")
        safe_content = article['content'].replace('\\', '\\\\').replace('`', r'\`').replace('${', r'\${')

        # 现在f-string变得非常清晰和安全
        ts_object = f"""
  {{
    id: '{article['id']}',
    title: '{safe_title}',
    author: '{safe_author}',
    content: `{safe_content}`
  }}"""
        ts_objects.append(ts_object)

    # 组合成最终的TS文件内容
    final_content = f"""import {{ Article }} from '../types/article';

export const articles: Article[] = [
{',\n'.join(ts_objects)}
];
"""
    try:
        with open(ARTICLES_DATA_PATH, 'w', encoding='utf-8') as f:
            f.write(final_content)
        print(f"成功创建数据文件: {ARTICLES_DATA_PATH}")
    except IOError as e:
        print(f"错误：无法写入文件 {ARTICLES_DATA_PATH}。原因: {e}", file=sys.stderr)
        sys.exit(1)

# --- 主函数 ---
def main():
    """执行所有步骤"""
    print("---")
    print("--- 开始处理文章数据 ---")
    create_article_type_definition()
    articles = process_articles()
    if articles:
        create_data_file(articles)
    else:
        print("没有找到可处理的文章，已跳过数据文件生成。 সন")
    print("--- 所有任务已完成 ---")

if __name__ == "__main__":
    main()
