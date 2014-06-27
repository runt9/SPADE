#!/usr/bin/env python

import sys
import os
import re
from xml.etree.ElementTree import Element, SubElement, tostring

def usage():
    print "Usage: %s <output_xml>" % os.path.basename(sys.argv[0])
    print " <output_xml> must be the path to where you want the xml file saved"

def main():
    args = sys.argv
    if len(args) != 2:
        usage()
        sys.exit(1)

    # Make the first argument the output file
    outputXmlFile = args[1]
    directory = os.path.dirname(outputXmlFile)
    if not os.path.isdir(directory):
        os.makedirs(directory)

    # Start off with the root checkstyle element and version
    outXml = Element('checkstyle')
    outXml.set('version', '5.6')

    for line in sys.stdin:
        sys.stdout.write(line)

        match = re.search('^\*+\sModule\sSPADE_main\.(.*)$', line)
        if match:
            fileElement = Element('file')
            fileElement.set('name', match.group(1))
            continue

        match = re.search('^([A-Z]):\s(.*),(.*):(.*):\s(.*)$', line)
        if match:
            errorElement = Element('error')
            errorElement.set('severity', match.group(1))
            errorElement.set('line', str(match.group(2)))
            errorElement.set('column', str(match.group(3)))
            errorElement.set('source', match.group(4))
            errorElement.set('message', match.group(5))

            fileElement.append(errorElement)

        outXml.append(fileElement)

    # Open up the xml file, write the xml header line, then dump out the output xml information
    fh = open(outputXmlFile, 'w')
    fh.write('<?xml version="1.0" encoding="UTF-8"?>')
    fh.write(tostring(outXml))
    fh.close()

if __name__ == '__main__':
    main()
