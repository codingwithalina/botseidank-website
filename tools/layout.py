#!/usr/bin/env python3
"""Setzt Header und Footer aus tools/partials/ in alle Seiten ein.

Aufruf im Repo-Ordner:  python3 tools/layout.py
Header und Footer stehen in jeder Seite zwischen
<!-- layout:header --> ... <!-- /layout:header --> bzw. footer.
Fehlen die Markierungen, wird das erste <header>/<footer> der Seite ersetzt.
Der Link zur aktuellen Seite bekommt aria-current="page".
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PARTS = ROOT / "tools" / "partials"


def block(name, page):
    html = (PARTS / f"{name}.html").read_text(encoding="utf8").strip()
    if name == "header" and page != "index.html":
        html = html.replace(f'<a href="{page}">', f'<a href="{page}" aria-current="page">')
    return f"<!-- layout:{name} -->\n{html}\n<!-- /layout:{name} -->"


def apply(path):
    t = path.read_text(encoding="utf8")
    orig = t
    for name in ("header", "footer"):
        new = block(name, path.name)
        marked = re.compile(rf"<!-- layout:{name} -->.*?<!-- /layout:{name} -->", re.S)
        if marked.search(t):
            t = marked.sub(lambda m: new, t, count=1)
        else:
            tag = re.compile(rf"<{name}\b.*?</{name}>", re.S)
            if not tag.search(t):
                print(f"  {path.name}: kein <{name}> gefunden", file=sys.stderr)
                continue
            t = tag.sub(lambda m: new, t, count=1)
    if t != orig:
        path.write_text(t, encoding="utf8")
        print(f"aktualisiert: {path.name}")


if __name__ == "__main__":
    for p in sorted(ROOT.glob("*.html")):
        apply(p)
